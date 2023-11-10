import { ITypedLocalStorageService, TypedLocalStorageService } from "../TypedLocalStorageService";
import { Dictionary, Record, String, Number, Static } from 'runtypes'

export const MoreMessagesOldDbSchemaV1Type = Record({
    messages: Dictionary(
        String,
        Number
    )
})

export type MoreMessagesOldDbSchemaV1 = Static<typeof MoreMessagesOldDbSchemaV1Type>


export type IMoreMessagesOldLocalStorage = ITypedLocalStorageService<typeof MoreMessagesOldDbSchemaV1Type>

export function MoreMessagesOldLocalStorage(): IMoreMessagesOldLocalStorage {
    return TypedLocalStorageService(
        'moreMsgsDbV1',
        MoreMessagesOldDbSchemaV1Type
    )
}