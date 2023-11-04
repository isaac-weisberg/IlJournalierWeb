import { INeverSentMessageStorageService } from "./NeverSentMessageStorageService"

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

export function StagedMessageStorage(neverSentMessagesStorageService: INeverSentMessageStorageService): IStagedMessageStorage {
    let neverSentMessages: {
        entries: NeverSentMessage[]
    }

    neverSentMessages = neverSentMessagesStorageService.read() || {
        entries: []
    }

    let syncScheduled = false
    function syncToStorage() {
        if (syncScheduled) {
            return
        }
        
        syncScheduled = true
        setTimeout(() => {
            neverSentMessagesStorageService.write(neverSentMessages)
            syncScheduled = false
        }, 0)
    }

    function storeANeverSentMessage(message: NeverSentMessageWithNoId) {
        const id = self.crypto.randomUUID()
        const entry = {
            id: id,
            userId: message.userId,
            msg: message.msg,
            unixSeconds: message.unixSeconds
        }

        neverSentMessages.entries.push(entry)

        syncToStorage()
    }

    function getNeverSentMessages(userId: string): NeverSentMessage[] {
        return compactMap(neverSentMessages.entries, (el) => {
            if (el.userId == userId) {
                return el
            }
            return undefined
        })
    }

    return {
        storeANeverSentMessage,
        getNeverSentMessages,
        removeNeverSentMessages(ids) {
            neverSentMessages.entries = neverSentMessages.entries.filter((el) => {
                return !ids.includes(el.id)
            })

            syncToStorage()
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