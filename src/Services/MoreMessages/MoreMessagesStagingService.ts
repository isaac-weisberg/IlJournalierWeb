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
    let currentDownloadPromise: any

    function stageMessage(message: StagedMessage) {
        if (currentDownloadPromise) {
            stagedMessageStorage.storeANeverSentMessage({
                userId: sessionCreds.userId,
                unixSeconds: message.unixSeconds,
                msg: message.msg
            })
        } else {

            currentDownloadPromise = moreMessageRequestService.sendMessages(
                sessionCreds.accessToken,
                [
                    {
                        unixSeconds: message.unixSeconds,
                        msg: message.msg
                    }
                ]
            )
        }
    }


    return {
        stageMessage
    }
}