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
    
    let loading = false
    async function sendNeverSentMessagesIfNeeded() {
        if (loading) {
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

        loading = true
        
        try {
            await moreMessageRequestService.sendMessages(
                sessionCreds.accessToken,
                messagesToSend
            )
        } catch {
            loading = false
            // shame
            return
        }

        stagedMessageStorage.removeNeverSentMessages(allNeverSentMessages.map(msg => msg.id))
        loading = false
        sendNeverSentMessagesIfNeeded()
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