import { SessionCreds } from "../../Models/SessionCreds"
import { convertMaybeIntoCauseChain } from "../../Util/ErrorExtensions"
import { IMoreMessagesLocalBackupService } from "../MoreMessagesLocalBackup.ts/MoreMessagesLocalBackupService"
import { IMoreMessageRequestService } from "./MoreMessageRequestService"
import { IStagedMessageStorage } from "./StagedMessageStorage"

export interface IMoreMessageStagingService {
    stageMessage(message: StagedMessage): void
}

export interface StagedMessage {
    unixSeconds: number
    msg: string
}

export function MoreMessageStagingService(
    di: {
        sessionCreds: SessionCreds,
        stagedMessageStorage: IStagedMessageStorage,
        moreMessageRequestService: IMoreMessageRequestService,
        moreMessagesLocalBackupService: IMoreMessagesLocalBackupService
    }
): IMoreMessageStagingService {
    
    let loading = false
    async function sendNeverSentMessagesIfNeeded() {
        if (loading) {
            return
        }

        const allNeverSentMessages = di.stagedMessageStorage.getNeverSentMessages(di.sessionCreds.userId)
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

        di.stagedMessageStorage.removeNeverSentMessages(messageIdsToRemove)
        loading = false
        sendNeverSentMessagesIfNeeded()
    }

    function stageMessage(message: StagedMessage) {
        const messageId = self.crypto.randomUUID()
        const entry = {
            id: messageId,
            userId: di.sessionCreds.userId,
            unixSeconds: message.unixSeconds,
            msg: message.msg  
        } 

        di.stagedMessageStorage.storeANeverSentMessage(entry)
        di.moreMessagesLocalBackupService.saveMessage(entry)

        sendNeverSentMessagesIfNeeded()
    }

    return {
        stageMessage
    }
}