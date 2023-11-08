import { IRamCachedTypedLocalStorage, RamCachedTypedLocalStorage } from "../RamCachedTypedLocalStorage/RamCachedTypedLocalStorage";
import { TypedLocalStorageService } from "../TypedLocalStorageService";
import { Record, String, Number, Array, Static } from 'runtypes'

const MoreMessagesLocalBackupDbType = Record({
    messages: Array(Record({
        id: String,
        userId: String,
        unixSeconds: Number,
        msg: String,
    }))
})

export interface IMoreMessagesLocalBackupDbStorage extends IRamCachedTypedLocalStorage<typeof MoreMessagesLocalBackupDbType, Static<typeof MoreMessagesLocalBackupDbType>> {}

export function MoreMessagesLocalBackupDbStorage(): IMoreMessagesLocalBackupDbStorage {
    return RamCachedTypedLocalStorage(
        TypedLocalStorageService(
            "moreMessagesLocalBackupDb",
            MoreMessagesLocalBackupDbType
        ),
        {
            messages: []
        }
    )
}
