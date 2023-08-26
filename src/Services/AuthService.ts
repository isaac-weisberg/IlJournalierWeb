import { IAuthStorageService } from "./AuthStorageService"

export interface IAuthService {
    userAuthIsKnown(): boolean
}

export function AuthService(authStorage: IAuthStorageService): IAuthService {
    return {
        userAuthIsKnown() {
            return !!authStorage.getAccessToken()
        },
    }
}