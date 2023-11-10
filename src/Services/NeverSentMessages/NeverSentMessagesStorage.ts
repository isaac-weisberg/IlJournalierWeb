import { INeverSentMessagesLocalStorage } from "./NeverSentMessagesLocalStorage"

export interface INeverSentMessagesStorage {
    storeANeverSentMessage(userId: string, message: NeverSentMessage): void
    getNeverSentMessages(userId: string): NeverSentMessage[]
    removeNeverSentMessages(userId: string, ids: string[]): void
}

export interface NeverSentMessage {
    id: string
    unixSeconds: number
    msg: string
}

export function NeverSentMessagesStorage(neverSentMessagesStorageService: INeverSentMessagesLocalStorage): INeverSentMessagesStorage {
    const neverSentMessages = neverSentMessagesStorageService.read() || {
        users: {}
    }

    return {
        storeANeverSentMessage(userId, message) {
            if (neverSentMessages.users[userId]) {
                neverSentMessages.users[userId].messages.push(message)
            } else {
                neverSentMessages.users[userId] = {
                    messages: [message]
                }
            }

            neverSentMessagesStorageService.write(neverSentMessages)
        },
        getNeverSentMessages(userId: string): NeverSentMessage[] {
            const user = neverSentMessages.users[userId]
            if (!user) {
                return []
            }

            return user.messages
        },
        removeNeverSentMessages(userId, ids) {
            if (neverSentMessages.users[userId]) {
                neverSentMessages.users[userId].messages = neverSentMessages.users[userId].messages.filter((message) => {
                    return !ids.includes(message.id)
                })
            }
            
            neverSentMessagesStorageService.write(neverSentMessages)
        }
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