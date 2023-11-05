import { SessionCreds } from "../../Models/SessionCreds"
import { convertMaybeIntoCauseChain } from "../../Util/ErrorExtensions"
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
        } catch(e) {
            loading = false

            console.error("failod", convertMaybeIntoCauseChain(e))
            // shame
            return
        }
        const messageIdsToRemove = allNeverSentMessages.map(msg => msg.id)

        stagedMessageStorage.removeNeverSentMessages(messageIdsToRemove)
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