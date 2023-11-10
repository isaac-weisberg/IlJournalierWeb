import { SessionCreds } from "../../Models/SessionCreds"
import { convertMaybeIntoCauseChain, wA } from "../../Util/ErrorExtensions"
import { IMoreMessagesLocalBackupService } from "../MoreMessagesLocalBackup.ts/MoreMessagesLocalBackupService"
import { IMoreMessageRequestService } from "./MoreMessageRequestService"
import { INeverSentMessagesStorage } from "../NeverSentMessages/NeverSentMessagesStorage"

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
        moreMessagesLocalBackupService: IMoreMessagesLocalBackupService
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
            await di.moreMessageRequestService.sendMessages(
                di.sessionCreds.accessToken,
                messagesToSend
            )
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
        const messageId = self.crypto.randomUUID()
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
                const id = self.crypto.randomUUID()
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