import { SessionCreds } from "../../Models/SessionCreds"
import { IMoreMessagesRequestService } from "./MoreMessagesRequestService"
import { IStagedMessageStorage } from "./StagedMessageStorage"

export interface IMoreMessagesStagingService {
    stageMessage(message: StagedMessage): void
}

export interface StagedMessage {
    unixSeconds: number
    msg: string
}

export function MoreMessagesStagingService(
    sessionCreds: SessionCreds,
    stagedMessageStorage: IStagedMessageStorage,
    moreMessageRequestService: IMoreMessagesRequestService
): IMoreMessagesStagingService {
    let currentDownloadPromise: Promise<void>|undefined

    function sendNeverSentMessagesIfNeeded() {
        const allNeverSentMessages = stagedMessageStorage.getNeverSentMessages(sessionCreds.userId)
        if (allNeverSentMessages.length == 0) {
            return
        }

        if (currentDownloadPromise) {
            console.error("WHAT THE FUCK?!")
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
        if (currentDownloadPromise) {
            stagedMessageStorage.storeANeverSentMessage({
                userId: sessionCreds.userId,
                unixSeconds: message.unixSeconds,
                msg: message.msg
            })
        } else {
            const allNeverSentMessages = stagedMessageStorage.getNeverSentMessages(sessionCreds.userId)

            const messagesToSend = allNeverSentMessages.map(message => {
                return {
                    msg: message.msg,
                    unixSeconds: message.unixSeconds
                }
            }).concat([
                {
                    unixSeconds: message.unixSeconds,
                    msg: message.msg
                }
            ])

            moreMessageRequestService.sendMessages(
                sessionCreds.accessToken,
                messagesToSend
            )
            .then(() => {
                stagedMessageStorage.removeNeverSentMessages(allNeverSentMessages.map(msg => msg.id))
            })
            .catch(() => {
                stagedMessageStorage.storeANeverSentMessage({
                    userId: sessionCreds.userId,
                    unixSeconds: message.unixSeconds,
                    msg: message.msg
                })
            })
            .finally(() => {
                currentDownloadPromise = undefined
                sendNeverSentMessagesIfNeeded()
            })
        }
    }


    return {
        stageMessage
    }
}