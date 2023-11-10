import { moreMessagesDbSchemaV1StorageKey } from "../../Util/Const";
import { ITypedLocalStorageService, TypedLocalStorageService } from "../TypedLocalStorageService";
import { MoreMessagesOldDbSchemaV1Type } from "./MoreMessagesDbSchemaV1";

export type IMoreMessagesOldLocalStorage = ITypedLocalStorageService<typeof MoreMessagesOldDbSchemaV1Type>

export function MoreMessagesOldLocalStorage(): IMoreMessagesOldLocalStorage {
    return TypedLocalStorageService(
        moreMessagesDbSchemaV1StorageKey,
        MoreMessagesOldDbSchemaV1Type
    )
}