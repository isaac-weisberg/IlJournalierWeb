import { ILastIdLocalStorage } from "./LocalLastIdDatabase"

export interface IMoreMessageLocalIdService {
    generateNewId(): string
}

export function MoreMessageLocalIdService(localLastIdDatabase: ILastIdLocalStorage): IMoreMessageLocalIdService {
    let database = localLastIdDatabase.read() || {
        lastUsedMoreMessageId: 0
    }

    return {
        generateNewId() {
            database.lastUsedMoreMessageId += 1
            localLastIdDatabase.write(database)
            return database.lastUsedMoreMessageId.toString()
        },
    }
}
