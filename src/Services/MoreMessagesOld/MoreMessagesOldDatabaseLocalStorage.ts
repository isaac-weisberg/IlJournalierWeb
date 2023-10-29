import { moreMessagesDbSchemaV1StorageKey } from "../../Util/Const";
import { ITypedLocalStorageService, TypedLocalStorageService } from "../TypedLocalStorageService";
import { MoreMessagesOldDbSchemaV1Type } from "./MoreMessagesDbSchemaV1";

export type IMoreMessagesOldDatabaseLocalStorage = ITypedLocalStorageService<typeof MoreMessagesOldDbSchemaV1Type>

export function MoreMessagesOldDatabaseLocalStorage(): IMoreMessagesOldDatabaseLocalStorage {
    return TypedLocalStorageService(
        moreMessagesDbSchemaV1StorageKey,
        MoreMessagesOldDbSchemaV1Type
    )
}