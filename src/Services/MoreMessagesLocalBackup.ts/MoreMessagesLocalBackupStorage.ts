import { ITypedLocalStorageService, TypedLocalStorageService } from "../TypedLocalStorageService";
import { Record, String, Number, Array, Dictionary } from 'runtypes'

const MoreMessagesLocalBackupDbType = Record({
    users: Dictionary(
        Record(
            {
                messages: Array(
                    Record(
                        {
                            id: String,
                            unixSeconds: Number,
                            msg: String,
                        }
                    )
                )
            }
        ),
        String
    )
})

export interface IMoreMessagesLocalBackupStorage extends ITypedLocalStorageService<typeof MoreMessagesLocalBackupDbType> {}

export function MoreMessagesLocalBackupStorage(): IMoreMessagesLocalBackupStorage {
    return TypedLocalStorageService(
        "moreMessagesLocalBackupDb",
        MoreMessagesLocalBackupDbType
    )
}
