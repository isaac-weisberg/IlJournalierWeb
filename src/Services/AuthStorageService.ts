import { Record, String} from "runtypes"
import { SessionCreds } from "../Models/SessionCreds"
import { ITypedLocalStorageHandle, ITypedLocalStorageService, TypedLocalStorageHandle } from "./TypedLocalStorageService"

export interface IAuthStorageService {
    getExistingSessionCreds(): SessionCreds|undefined
    updateCreds(c: SessionCreds|undefined): void
}

const accessTokenStorageKey = 'auth_totalData'

const authDatabaseType = Record({
    userId: String,
    accessToken: String,
    saultGoodman: String
})

const authDataDatabaseHandle = TypedLocalStorageHandle(accessTokenStorageKey, authDatabaseType)

export function AuthStorageService(typedLocalStorage: ITypedLocalStorageService): IAuthStorageService {
    function getExistingSessionCreds(): SessionCreds|undefined {
        return typedLocalStorage.read(authDataDatabaseHandle)?.record
    }

    function updateCreds(c: SessionCreds) {
        if (c) {
            typedLocalStorage.write(c, authDataDatabaseHandle)
        } else {
            typedLocalStorage.remove(authDataDatabaseHandle)
        }
    }

    return {
        getExistingSessionCreds,
        updateCreds
    }
}