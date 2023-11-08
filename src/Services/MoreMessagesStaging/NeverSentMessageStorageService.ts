import { Record, String, Number, Array, Static } from "runtypes"
import { TypedLocalStorageService } from "../TypedLocalStorageService"
import { IRamCachedTypedLocalStorage, RamCachedTypedLocalStorage } from "../RamCachedTypedLocalStorage/RamCachedTypedLocalStorage"

const neverSentMessagesDbName = 'neverSentMessagesDbName'

const NeverSentMessagesDatabaseType = Record({
    entries: Array(Record({
        id: String,
        userId: String,
        unixSeconds: Number,
        msg: String
    }))
})

export interface INeverSentMessageStorageService extends IRamCachedTypedLocalStorage<typeof NeverSentMessagesDatabaseType, Static<typeof NeverSentMessagesDatabaseType>> { }

export function NeverSentMessageStorageService(): INeverSentMessageStorageService {
    return RamCachedTypedLocalStorage(
        TypedLocalStorageService(neverSentMessagesDbName, NeverSentMessagesDatabaseType),
        {
            entries: []
        }
    )
}