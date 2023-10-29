import { SessionCreds } from "../../../Models/SessionCreds"
import { IAuthLocalStorage } from "../../../Services/Auth/AuthLocalStorage"
import { IAuthService } from "../../../Services/AuthService"
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
        setLoading(l: boolean): void
        onUserCreated(u: UserCredsAndLoginInfo): void,
        onLoginFailed(e: unknown): void
        onCreateUserFailed(e: unknown): void
    }
    
    createNewUser(): void
    login(loginInfo: string): void
    userHasSavedLoginInfoAndWantsToProceed(u: UserCredsAndLoginInfo): void
    saveToClipboard(loginKey: string): Promise<void>
}

export function CreateUserPresenter(authService: IAuthService, authStorage: IAuthLocalStorage): ICreateUserPresenter {
    return {
        async saveToClipboard(loginKey) {
            await navigator.clipboard.writeText(loginKey)
        },
        userHasSavedLoginInfoAndWantsToProceed(u: UserCredsAndLoginInfo) {
            this.navigation?.onUserLoggedIn(u.creds)
        },
        async login(loginInfo) {
            this.view?.setLoading(true)
            
            let creds: SessionCreds
            try {
                creds = await wA('login failed', async () => {
                    return await authService.login(loginInfo)
                })
            } catch(e) {
                this.view?.onLoginFailed(e)

                return
            } finally {
                this.view?.setLoading(false)
            }

            authStorage.write(creds)

            this.navigation?.onUserLoggedIn(creds)
        },

        async createNewUser() {
            this.view?.setLoading(true)

            let u: {creds: SessionCreds, loginInfo: string}
            try {
                u = await wA('creating new user failed', async () => {
                    return await authService.createUser()
                })
            } catch(e) {
                debugLogE(e)
                this.view?.onCreateUserFailed(e)

                return
            } finally {
                this.view?.setLoading(false)
            }

            authStorage.write(u.creds)
            
            this.view?.onUserCreated(u)
        }
    }
}