import { ITypedLocalStorageService, TypedLocalStorageService } from "../TypedLocalStorageService";
import { FlagsDbSchemaV1Type } from "./FlagsDbSchemaV1";

export interface IFlagsDatabaseLocalStorage extends ITypedLocalStorageService<typeof FlagsDbSchemaV1Type> { }

export function FlagsDatabaseLocalStorage(): IFlagsDatabaseLocalStorage {
    return TypedLocalStorageService('flagDbV1', FlagsDbSchemaV1Type)
}