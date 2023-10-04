import { SessionCreds } from "../../../Models/SessionCreds"
import { IAuthService } from "../../../Services/AuthService"
import { IAuthStorageService } from "../../../Services/AuthStorageService"
import { debugLogE, wA } from "../../../Util/ErrorExtensions"

interface UserCredsAndLoginInfo { 
    loginInfo: string, 
    creds: SessionCreds
}

export interface ICreateUserPresenter {
    navigation?: {
        onUserLoggedIn: (u: SessionCreds) => void
    }

    view?: {
        onUserCreated: (u: UserCredsAndLoginInfo) => void,
        onLoginFailed: (e: unknown) => void
        onCreateUserFailed: (e: unknown) => void
    }
    
    createNewUser(): void
    login(loginInfo: string): void
    userHasSavedLoginInfoAndWantsToProceed(u: UserCredsAndLoginInfo): void
    saveToClipboard(loginKey: string): Promise<void>
}

export function CreateUserPresenter(authService: IAuthService, authStorage: IAuthStorageService): ICreateUserPresenter {
    return {
        async saveToClipboard(loginKey) {
            await navigator.clipboard.writeText(loginKey)
        },
        userHasSavedLoginInfoAndWantsToProceed(u: UserCredsAndLoginInfo) {
            this.navigation?.onUserLoggedIn(u.creds)
        },
        async login(loginInfo) {
            let creds: SessionCreds
            try {
                creds = await wA('login failed', async () => {
                    return await authService.login(loginInfo)
                })
            } catch(e) {
                this.view?.onLoginFailed(e)

                return
            }

            authStorage.updateCreds(creds)

            this.navigation?.onUserLoggedIn(creds)
        },

        async createNewUser() {
            let u: {creds: SessionCreds, loginInfo: string}
            try {
                u = await wA('creating new user failed', async () => {
                    return await authService.createUser()
                })
            } catch(e) {
                debugLogE(e)
                this.view?.onCreateUserFailed(e)

                return
            }

            authStorage.updateCreds(u.creds)
            
            this.view?.onUserCreated(u)
        }
    }
}