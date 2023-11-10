import { ITypedLocalStorageService, TypedLocalStorageService } from "../TypedLocalStorageService";
import { Record, String, Number, Array } from 'runtypes'

const MoreMessagesLocalBackupDbType = Record({
    messages: Array(Record({
        id: String,
        userId: String,
        unixSeconds: Number,
        msg: String,
    }))
})

export interface IMoreMessagesLocalBackupDbStorage extends ITypedLocalStorageService<typeof MoreMessagesLocalBackupDbType> {}

export function MoreMessagesLocalBackupDbStorage(): IMoreMessagesLocalBackupDbStorage {
    return TypedLocalStorageService(
        "moreMessagesLocalBackupDb",
        MoreMessagesLocalBackupDbType
    )
}
