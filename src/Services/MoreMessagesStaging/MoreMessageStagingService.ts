import { SessionCreds } from "../../Models/SessionCreds"
import { convertMaybeIntoCauseChain } from "../../Util/ErrorExtensions"
import { IMoreMessagesLocalBackupService } from "../MoreMessagesLocalBackup.ts/MoreMessagesLocalBackupService"
import { IMoreMessageRequestService } from "./MoreMessageRequestService"
import { INeverSentMessagesStorage } from "../NeverSentMessages/NeverSentMessagesStorage"

export interface IMoreMessageStagingService {
    stageMessage(message: StagedMessage): Promise<void>
    stageMultipleLegacyMessages(messages: StagedMessage[]): Promise<void>
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

        di.neverSentMessagesStorage.removeNeverSentMessages(messageIdsToRemove)
        loading = false
        sendNeverSentMessagesIfNeeded()
    }

    async function stageMessage(message: StagedMessage) {
        const messageId = self.crypto.randomUUID()
        const entry = {
            id: messageId,
            userId: di.sessionCreds.userId,
            unixSeconds: message.unixSeconds,
            msg: message.msg  
        } 

        di.neverSentMessagesStorage.storeANeverSentMessage(entry)
        di.moreMessagesLocalBackupService.saveMessage(entry)

        await sendNeverSentMessagesIfNeeded()
    }

    async function stageMultipleLegacyMessages(messages: StagedMessage[]) {
        const entries = messages.map((message) => {
            const messageId = self.crypto.randomUUID()
            const entry = {
                id: messageId,
                userId: di.sessionCreds.userId,
                unixSeconds: message.unixSeconds,
                msg: message.msg  
            } 
            return entry
        })

        di.neverSentMessagesStorage.storeMultipleNeverSentMessages(entries)

        // not gonna local backup legacy messages, sry
        // di.moreMessagesLocalBackupService.saveMessage(entry)


        await sendNeverSentMessagesIfNeeded()
    }

    return {
        stageMessage,
        stageMultipleLegacyMessages: stageMultipleLegacyMessages
    }
}