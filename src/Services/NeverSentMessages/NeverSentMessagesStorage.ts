import { Never } from "runtypes"
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
    function storeANeverSentMessage(message: NeverSentMessage) {
        const neverSentMessages = neverSentMessagesStorageService.read()

        neverSentMessages.entries.push(message)
        
        neverSentMessagesStorageService.write(neverSentMessages)
    }

    function getNeverSentMessages(userId: string): NeverSentMessage[] {
        return compactMap(neverSentMessagesStorageService.read().entries, (el) => {
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
            const neverSentMessages = neverSentMessagesStorageService.read()
            neverSentMessages.entries = neverSentMessages.entries.filter((el) => {
                return !ids.includes(el.id)
            })

            neverSentMessagesStorageService.write(neverSentMessages)
        },
        storeMultipleNeverSentMessages(messages) {    
            const neverSentMessages = neverSentMessagesStorageService.read()

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