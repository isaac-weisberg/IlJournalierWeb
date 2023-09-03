import { IAuthStorageService } from "./AuthStorageService"

export interface IAuthService {
    userAuthIsKnown(): boolean
    logIntoANewUser(u: {accessToken: string}): void
}

export function AuthService(authStorage: IAuthStorageService): IAuthService {
    return {
        userAuthIsKnown() {
            return false
            // return !!authStorage.getAccessToken()
        },
        logIntoANewUser(u) {
            authStorage.setAccessToken(u.accessToken)
        }
    }
}