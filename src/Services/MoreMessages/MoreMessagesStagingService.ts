import { SessionCreds } from "../../Models/SessionCreds"
import { IStagedMessageStorage } from "./StagedMessageStorage"

export interface IMoreMessagesStagingService {

}

export interface StagedMessage {
    unixSeconds: number
    msg: string
}

export function MoreMessagesStagingService(
    sessionCreds: SessionCreds,
    stagedMessageStorage: IStagedMessageStorage
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

        }
    }


    return {

    }
}