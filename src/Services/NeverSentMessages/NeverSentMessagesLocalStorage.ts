import { Record, String, Number, Array, Static, Dictionary } from "runtypes"
import { ITypedLocalStorageService, TypedLocalStorageService } from "../TypedLocalStorageService"

const neverSentMessagesDbName = 'neverSentMessagesDbName'

const NeverSentMessagesDatabaseType = Record(
    {
        users: Dictionary(
            Record(
                {
                    messages: Array(Record({
                        id: String,
                        unixSeconds: Number,
                        msg: String
                    }))
                }
            ),
            String
        ),
    }
)

export interface INeverSentMessagesLocalStorage extends ITypedLocalStorageService<typeof NeverSentMessagesDatabaseType> { }

export function NeverSentMessagesLocalStorage(): INeverSentMessagesLocalStorage {
    return TypedLocalStorageService(neverSentMessagesDbName, NeverSentMessagesDatabaseType)
}
