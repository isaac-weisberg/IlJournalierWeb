import { INeverSentMessagesStorageService } from "./MoreMessagesStorageService"

export interface IStagedMessageStorage {
    storeANeverSentMessage(message: NeverSentMessageWithNoId): void
    getNeverSentMessages(userId: string): NeverSentMessage[]
    removeNeverSentMessages(ids: string[]): void
}

export interface NeverSentMessage {
    id: string
    userId: string
    unixSeconds: number
    msg: string
}

export interface NeverSentMessageWithNoId {
    userId: string
    unixSeconds: number
    msg: string
}

export function StagedMessageStorage(neverSentMessagesStorageService: INeverSentMessagesStorageService): IStagedMessageStorage {
    function storeANeverSentMessage(message: NeverSentMessageWithNoId) {
        const id = self.crypto.randomUUID()
        const entry = {
            id: id,
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

    function getNeverSentMessages(userId: string): NeverSentMessage[] {
        let neverSentMessages = neverSentMessagesStorageService.read()

        if (neverSentMessages) {
            return compactMap(neverSentMessages.entries, (el) => {
                if (el.userId == userId) {
                    return el
                }
                return undefined
            })
        }

        return []
    }

    return {
        storeANeverSentMessage,
        getNeverSentMessages,
        removeNeverSentMessages(ids) {
            const neverSentMessages = neverSentMessagesStorageService.read()
            if (neverSentMessages) {
                const newEntries = neverSentMessages.entries.filter((el) => {
                    return !ids.includes(el.id)
                })

                neverSentMessagesStorageService.write({
                    entries: newEntries
                })
            }
        },
    }
}

function compactMap<El, Target>(arr: El[], predicate: (el: El) => Target|undefined): Target[] {
    let newArr = Array<Target>(arr.length)
    for (const el of arr) {
        const target = predicate(el)
        if (target) {
            newArr.push(target)
        }
    }
    return newArr
}