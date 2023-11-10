import { IMoreMessagesLocalBackupDbStorage } from "./MoreMessagesLocalBackupStorage"


interface BackupMessage {
    id: string,
    userId: string,
    msg: string, 
    unixSeconds: number
}

export interface IMoreMessagesLocalBackupService {
    saveMessage(msg: BackupMessage): void
    saveMessages(msgs: BackupMessage[]): void
}

export function MoreMessagesLocalBackupService(
    localBackupStorage: IMoreMessagesLocalBackupDbStorage
): IMoreMessagesLocalBackupService {
    let currentDatabase = localBackupStorage.read() || { messages: [] }

    return {
        saveMessage(msg) {
            currentDatabase.messages.push(msg)
            localBackupStorage.write(currentDatabase)
        },
        saveMessages(msgs) {
            currentDatabase.messages = currentDatabase.messages.concat(msgs)
            localBackupStorage.write(currentDatabase)
        },
    }
}