import { SessionCreds } from "../../Models/SessionCreds"
import { convertMaybeIntoCauseChain, wA } from "../../Util/ErrorExtensions"
import { IMoreMessagesLocalBackupService } from "../MoreMessagesLocalBackup/MoreMessagesLocalBackupService"
import { IMoreMessageRequestService } from "./MoreMessageRequestService"
import { INeverSentMessagesStorage } from "../NeverSentMessages/NeverSentMessagesStorage"
import { IMoreMessageLocalIdService } from "../MoreMessageLocalIdService/MoreMessageLocalIdService"

export interface IMoreMessageStagingService {
    stageMessage(message: StagedMessage): Promise<void>
    aggressiveSendLegacyMessages(messages: StagedMessage[]): Promise<void>
    localSaveLegacyMessages(messages: StagedMessage[]): void
}

export interface StagedMessage {
    unixSeconds: number
    msg: string
}

export function MoreMessageStagingService(
    di: {
        sessionCreds: SessionCreds,
        neverSentMessagesStorage: INeverSentMessagesStorage,
        moreMessageRequestService: IMoreMessageRequestService,
        moreMessagesLocalBackupService: IMoreMessagesLocalBackupService,
        moreMessageLocalIdService: IMoreMessageLocalIdService
    }
): IMoreMessageStagingService {
    let loading = false
    async function sendNeverSentMessagesIfNeeded() {
        if (loading) {
            return
        }

        const allNeverSentMessages = di.neverSentMessagesStorage.getNeverSentMessages(di.sessionCreds.userId)
        if (allNeverSentMessages.length == 0) {
            return
        }

        const messagesToSend = allNeverSentMessages.map(message => {
            return {
                msg: message.msg,
                unixSeconds: message.unixSeconds
            }
        })

        loading = true

        try {
            await wA('sendMessages failed', async () => await di.moreMessageRequestService.sendMessages(
                di.sessionCreds.accessToken,
                messagesToSend
            ))
        } catch(e) {
            loading = false

            console.error("failod", convertMaybeIntoCauseChain(e))
            // shame
            return
        }
        const messageIdsToRemove = allNeverSentMessages.map(msg => msg.id)

        di.neverSentMessagesStorage.removeNeverSentMessages(di.sessionCreds.userId, messageIdsToRemove)
        loading = false
        sendNeverSentMessagesIfNeeded()
    }

    async function stageMessage(message: StagedMessage) {
        const messageId = di.moreMessageLocalIdService.generateNewId()
        const entry = {
            id: messageId,
            unixSeconds: message.unixSeconds,
            msg: message.msg
        } 

        di.neverSentMessagesStorage.storeANeverSentMessage(di.sessionCreds.userId, entry)
        di.moreMessagesLocalBackupService.saveMessage(di.sessionCreds.userId, entry)

        await sendNeverSentMessagesIfNeeded()
    }

    async function aggressiveSendLegacyMessages(messages: StagedMessage[]) {
        return await wA('send messages failed', async () => {
            return await di.moreMessageRequestService.sendMessages(
                di.sessionCreds.accessToken,
                messages
            )
        })
    }

    return {
        stageMessage,
        aggressiveSendLegacyMessages,
        localSaveLegacyMessages(messages: StagedMessage[]) {
            const backupMessages = messages.map(message => {
                const id = di.moreMessageLocalIdService.generateNewId()
                const entry = {
                    id: id,
                    unixSeconds: message.unixSeconds,
                    msg: message.msg
                }
    
                return entry
            })
            di.moreMessagesLocalBackupService.saveMessages(di.sessionCreds.userId, backupMessages)
        }
    }
}

async function parallelMap<E, T>(arr: E[], transform: (e: E) => Promise<T>): Promise<T[]> {
    return Promise.all(arr.map(e => transform(e)))
}