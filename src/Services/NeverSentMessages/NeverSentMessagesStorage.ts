import { INeverSentMessagesLocalStorage } from "./NeverSentMessagesLocalStorage"

export interface INeverSentMessagesStorage {
    storeANeverSentMessage(message: NeverSentMessage): void
    storeMultipleNeverSentMessages(messages: NeverSentMessage[]): void
    getNeverSentMessages(userId: string): NeverSentMessage[]
    removeNeverSentMessages(ids: string[]): void
}

export interface NeverSentMessage {
    id: string
    userId: string
    unixSeconds: number
    msg: string
}

export function NeverSentMessagesStorage(neverSentMessagesStorageService: INeverSentMessagesLocalStorage): INeverSentMessagesStorage {
    const neverSentMessages = neverSentMessagesStorageService.read() || {
        entries: []
    }

    return {
        storeANeverSentMessage(message: NeverSentMessage) {
            neverSentMessages.entries.push(message)
            
            neverSentMessagesStorageService.write(neverSentMessages)
        },
        getNeverSentMessages(userId: string): NeverSentMessage[] {
            return compactMap(neverSentMessages.entries, (el) => {
                if (el.userId == userId) {
                    return el
                }
                return undefined
            })
        },
        removeNeverSentMessages(ids) {
            neverSentMessages.entries = neverSentMessages.entries.filter((el) => {
                return !ids.includes(el.id)
            })

            neverSentMessagesStorageService.write(neverSentMessages)
        },
        storeMultipleNeverSentMessages(messages) {    
            neverSentMessages.entries = neverSentMessages.entries.concat(messages)
            
            neverSentMessagesStorageService.write(neverSentMessages)
        },
    }
}

function compactMap<El, Target>(arr: El[], predicate: (el: El) => Target|undefined): Target[] {
    let newArr: Target[] = []
    for (const el of arr) {
        const target = predicate(el)
        if (target) {
            newArr.push(target)
        }
    }
    return newArr
}