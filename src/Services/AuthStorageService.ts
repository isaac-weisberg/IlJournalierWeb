import { SessionCreds } from "../Models/SessionCreds"

export interface IAuthStorageService {
    getExistingSessionCreds(): SessionCreds|undefined
    updateCreds(c: SessionCreds|undefined): void
}

const accessTokenStorageKey = 'auth_accessToken'
const saultGoodmanStorageKey = 'auth_saultGoodman'

export function AuthStorageService(): IAuthStorageService {
    function getExistingSessionCreds(): SessionCreds|undefined {
        const accessToken = window.localStorage.getItem(accessTokenStorageKey)
        const saultGoodman = window.localStorage.getItem(saultGoodmanStorageKey)
        if (accessToken && saultGoodman) {
            return {
                accessToken,
                saultGoodman
            }
        }
        return undefined
    }

    function updateCreds(c: SessionCreds) {
        if (c) {
            window.localStorage.setItem(accessTokenStorageKey, c.accessToken)
            window.localStorage.setItem(saultGoodmanStorageKey, c.saultGoodman)
        } else {
            window.localStorage.removeItem(accessTokenStorageKey)
            window.localStorage.removeItem(saultGoodmanStorageKey)
        }
    }

    return {
        getExistingSessionCreds,
        updateCreds
    }
}