import { Record, String } from "runtypes"
import { ITypedLocalStorageService, TypedLocalStorageService } from "../TypedLocalStorageService"

const authTotalDataStorageKey = 'auth_totalData'

const authDatabaseType = Record({
    userId: String,
    accessToken: String,
    saultGoodman: String
})

export type IAuthLocalStorage = ITypedLocalStorageService<typeof authDatabaseType>

export function AuthLocalStorage(): IAuthLocalStorage {
    return TypedLocalStorageService(authTotalDataStorageKey, authDatabaseType)
}