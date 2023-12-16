import { SessionCreds } from "../../Models/SessionCreds"
import { convertMaybeIntoCauseChain, convertMaybeIntoString, wA } from "../../Util/ErrorExtensions"
import { IMoreMessagesLocalBackupService } from "../MoreMessagesLocalBackup/MoreMessagesLocalBackupService"
import { IMoreMessageRequestService } from "./MoreMessageRequestService"
import { INeverSentMessagesStorage } from "../NeverSentMessages/NeverSentMessagesStorage"
import { IMoreMessageLocalIdService } from "../MoreMessageLocalIdService/MoreMessageLocalIdService"
import { IConsoleBus } from "../ConsoleBus/ConsoleBus"

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
        /* sessionCreds: SessionCreds,*/
        neverSentMessagesStorage: INeverSentMessagesStorage,
        moreMessageRequestService: IMoreMessageRequestService,
        moreMessagesLocalBackupService: IMoreMessagesLocalBackupService,
        moreMessageLocalIdService: IMoreMessageLocalIdService,
        consoleBus: IConsoleBus
    }
): IMoreMessageStagingService {
    let loading = false

    const userId = 'localUser'

    async function sendNeverSentMessagesIfNeeded() {
        if (process.env.USE_ILJOURNALIER_SERVER) {
            // if (loading) {
            //     return
            // }

            // const allNeverSentMessages = di.neverSentMessagesStorage.getNeverSentMessages(userId)
            // if (allNeverSentMessages.length == 0) {
            //     return
            // }

            // const messagesToSend = allNeverSentMessages.map(message => {
            //     return {
            //         msg: message.msg,
            //         unixSeconds: message.unixSeconds
            //     }
            // })

            // loading = true

            // try {
            //     await wA('sendMessages failed', async () => await di.moreMessageRequestService.sendMessages(
            //         di.sessionCreds.accessToken,
            //         messagesToSend
            //     ))
            // } catch(e) {
            //     loading = false

            //     di.consoleBus.post(convertMaybeIntoString(e))

            //     console.error("failod", convertMaybeIntoCauseChain(e))
            //     // shame
            //     return
            // }
            // const messageIdsToRemove = allNeverSentMessages.map(msg => msg.id)

            // di.neverSentMessagesStorage.removeNeverSentMessages(di.sessionCreds.userId, messageIdsToRemove)
            // loading = false
            // sendNeverSentMessagesIfNeeded()
        }
    }

    async function stageMessage(message: StagedMessage) {
        const messageId = di.moreMessageLocalIdService.generateNewId()
        const entry = {
            id: messageId,
            unixSeconds: message.unixSeconds,
            msg: message.msg
        } 

        if (process.env.USE_ILJOURNALIER_SERVER) {
            di.neverSentMessagesStorage.storeANeverSentMessage(userId, entry)
        }
        di.moreMessagesLocalBackupService.saveMessage(userId, entry)

        if (process.env.USE_ILJOURNALIER_SERVER) {
            await sendNeverSentMessagesIfNeeded()
        }
    }

    async function aggressiveSendLegacyMessages(messages: StagedMessage[]) {
        // return await wA('send messages failed', async () => {
        //     return await di.moreMessageRequestService.sendMessages(
        //         di.sessionCreds.accessToken,
        //         messages
        //     )
        // })
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
            di.moreMessagesLocalBackupService.saveMessages(userId, backupMessages)
        }
    }
}
