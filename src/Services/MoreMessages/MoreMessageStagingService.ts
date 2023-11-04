import { SessionCreds } from "../../Models/SessionCreds"
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
    sessionCreds: SessionCreds,
    stagedMessageStorage: IStagedMessageStorage,
    moreMessageRequestService: IMoreMessageRequestService
): IMoreMessageStagingService {
    
    let currentDownloadPromise: Promise<void>|undefined
    function sendNeverSentMessagesIfNeeded() {
        if (currentDownloadPromise) {
            return
        }

        const allNeverSentMessages = stagedMessageStorage.getNeverSentMessages(sessionCreds.userId)
        if (allNeverSentMessages.length == 0) {
            return
        }

        const messagesToSend = allNeverSentMessages.map(message => {
            return {
                msg: message.msg,
                unixSeconds: message.unixSeconds
            }
        })

        currentDownloadPromise = moreMessageRequestService.sendMessages(
            sessionCreds.accessToken,
            messagesToSend
        )
        .then(() => {
            stagedMessageStorage.removeNeverSentMessages(allNeverSentMessages.map(msg => msg.id))
        })
        .catch(() => {
            
        })
        .finally(() => {
            currentDownloadPromise = undefined
            sendNeverSentMessagesIfNeeded()
        })
    }

    function stageMessage(message: StagedMessage) {
        stagedMessageStorage.storeANeverSentMessage({
            userId: sessionCreds.userId,
            unixSeconds: message.unixSeconds,
            msg: message.msg
        })

        sendNeverSentMessagesIfNeeded()
    }

    return {
        stageMessage
    }
}