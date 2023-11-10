import { ITypedLocalStorageService, TypedLocalStorageService } from "../TypedLocalStorageService";
import { MoreMessagesOldDbSchemaV1Type } from "./MoreMessagesDbSchemaV1";

export type IMoreMessagesOldLocalStorage = ITypedLocalStorageService<typeof MoreMessagesOldDbSchemaV1Type>

export function MoreMessagesOldLocalStorage(): IMoreMessagesOldLocalStorage {
    return TypedLocalStorageService(
        'moreMsgsDbV1',
        MoreMessagesOldDbSchemaV1Type
    )
}