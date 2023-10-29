import { Record, String, Number, Array } from "runtypes"
import { ITypedLocalStorageService, TypedLocalStorageService } from "../TypedLocalStorageService"

const neverSentMessagesDbName = 'neverSentMessagesDbName'

const NeverSentMessagesDatabaseType = Record({
    entries: Array(Record({
        userId: String,
        unixSeconds: Number,
        msg: String
    }))
})

export type INeverSentMessagesStorageService = ITypedLocalStorageService<typeof NeverSentMessagesDatabaseType>

export function NeverSentMessagesStorageService(): INeverSentMessagesStorageService {
    return TypedLocalStorageService(neverSentMessagesDbName, NeverSentMessagesDatabaseType)
}