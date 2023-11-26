import { IMoreMessagesLocalBackupStorage } from "./MoreMessagesLocalBackupStorage"


interface BackupMessage {
    id: string,
    msg: string, 
    unixSeconds: number
}

export interface IMoreMessagesLocalBackupService {
    saveMessage(userId: string, msg: BackupMessage): void
    saveMessages(userId: string, msgs: BackupMessage[]): void
}

export function MoreMessagesLocalBackupService(
    localBackupStorage: IMoreMessagesLocalBackupStorage
): IMoreMessagesLocalBackupService {
    let currentDatabase = localBackupStorage.read() || { users: {} }

    return {
        saveMessage(userId, msg) {
            const user = currentDatabase.users[userId]
            if (currentDatabase.users[userId]) {
                user.messages.push(msg)
            } else {
                currentDatabase.users[userId] = {
                    messages: [ msg ]
                }
            }

            localBackupStorage.write(currentDatabase)
        },
        saveMessages(userId, msgs) {
            const user = currentDatabase.users[userId]
            if (currentDatabase.users[userId]) {
                user.messages = user.messages.concat(msgs)
            } else {
                currentDatabase.users[userId] = {
                    messages: msgs
                }
            }

            localBackupStorage.write(currentDatabase)
        },
    }
}