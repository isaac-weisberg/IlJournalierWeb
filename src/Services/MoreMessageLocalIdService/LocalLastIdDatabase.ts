import { Record, Number } from "runtypes"
import { ITypedLocalStorageService, TypedLocalStorageService } from "../TypedLocalStorageService"


const LocalLastIdDatabaseType = Record({
    lastUsedMoreMessageId: Number
})

export interface ILastIdLocalStorage extends ITypedLocalStorageService<typeof LocalLastIdDatabaseType> {
    
}

export function LastIdLocalStorage(): ILastIdLocalStorage {
    return TypedLocalStorageService('LastIdLocalStorage', LocalLastIdDatabaseType)
}