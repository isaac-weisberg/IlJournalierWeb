import { IMoreMessagesLocalBackupDbStorage } from "./MoreMessagesLocalBackupStorage"

export interface IMoreMessagesLocalBackupService {
    saveMessage(msg: { 
        id: string,
        userId: string,
        msg: string, 
        unixSeconds: number
    }): void
}

export function MoreMessagesLocalBackupService(
    localBackupStorage: IMoreMessagesLocalBackupDbStorage
): IMoreMessagesLocalBackupService {
    let currentDatabase = localBackupStorage.read() || { messages: [] }

    return {
        async saveMessage(msg) {
            currentDatabase.messages = currentDatabase.messages.concat(msg)

            await nextEventCycle()

            localBackupStorage.write(currentDatabase)
        },
    }
}

export function nextEventCycle(): Promise<void> {
    return new Promise((res) => {
        setTimeout(() => {
            res()
        }, 0)
    })
}