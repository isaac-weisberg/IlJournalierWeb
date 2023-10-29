import { INeverSentMessagesStorageService } from "./MoreMessagesStorageService"

export interface IStagedMessageStorage {
    storeANeverSentMessage(message: NeverSentMessage): void
    getNeverSentMessages(): NeverSentMessage[]
}

export interface NeverSentMessage {
    userId: string
    unixSeconds: number
    msg: string
}

export function StagedMessageStorage(neverSentMessagesStorageService: INeverSentMessagesStorageService): IStagedMessageStorage {
    function storeANeverSentMessage(message: NeverSentMessage) {
        const entry = {
            userId: message.userId,
            msg: message.msg,
            unixSeconds: message.unixSeconds
        }

        const neverSentMessages = neverSentMessagesStorageService.read()
        let newNeverSentMessages: typeof neverSentMessages
        if (neverSentMessages) {
            neverSentMessages.entries.push(entry)
            newNeverSentMessages = neverSentMessages
        } else {
            newNeverSentMessages = {
                entries: [ entry ]
            }
        }

        neverSentMessagesStorageService.write(newNeverSentMessages)
    }

    function getNeverSentMessages(): NeverSentMessage[] {
        let neverSentMessages = neverSentMessagesStorageService.read()

        return neverSentMessages?.entries || []        
    }

    return {
        storeANeverSentMessage,
        getNeverSentMessages
    }
}