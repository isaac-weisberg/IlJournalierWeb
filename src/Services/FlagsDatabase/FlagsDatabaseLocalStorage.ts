import { flagsDbSchemaV1StorageKey } from "../../Util/Const";
import { ITypedLocalStorageService, TypedLocalStorageService } from "../TypedLocalStorageService";
import { FlagsDbSchemaV1Type } from "./FlagsDbSchemaV1";

export type IFlagsDatabaseLocalStorage = ITypedLocalStorageService<typeof FlagsDbSchemaV1Type>

export function FlagsDatabaseLocalStorage(): IFlagsDatabaseLocalStorage {
    return TypedLocalStorageService(flagsDbSchemaV1StorageKey, FlagsDbSchemaV1Type)
}