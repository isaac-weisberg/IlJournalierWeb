import { Record, String, Number, Array, Static } from "runtypes"
import { ITypedLocalStorageService, TypedLocalStorageService } from "../TypedLocalStorageService"

const neverSentMessagesDbName = 'neverSentMessagesDbName'

const NeverSentMessagesDatabaseType = Record({
    entries: Array(Record({
        id: String,
        userId: String,
        unixSeconds: Number,
        msg: String
    }))
})

export interface INeverSentMessagesLocalStorage extends ITypedLocalStorageService<typeof NeverSentMessagesDatabaseType> { }

export function NeverSentMessagesLocalStorage(): INeverSentMessagesLocalStorage {
    return TypedLocalStorageService(neverSentMessagesDbName, NeverSentMessagesDatabaseType)
}
