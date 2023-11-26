import { SessionCreds } from "../../../Models/SessionCreds"
import { IAuthLocalStorage } from "../../../Services/Auth/AuthLocalStorage"
import { IAuthService } from "../../../Services/AuthService"
import { IConsoleBus } from "../../../Services/ConsoleBus/ConsoleBus"
import { convertMaybeIntoString, debugLogE, wA } from "../../../Util/ErrorExtensions"

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
        onUserCreated(u: UserCredsAndLoginInfo): void
    }
    
    createNewUser(): void
    login(loginInfo: string): void
    userHasSavedLoginInfoAndWantsToProceed(u: UserCredsAndLoginInfo): void
    saveToClipboard(loginKey: string): Promise<void>
}

export function CreateUserPresenter(
    di: {
        authService: IAuthService, 
        authStorage: IAuthLocalStorage,
        consoleBus: IConsoleBus
    }
): ICreateUserPresenter {
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
                    return await di.authService.login(loginInfo)
                })
            } catch(e) {
                di.consoleBus.post(convertMaybeIntoString(e))

                return
            } finally {
                this.view?.setLoading(false)
            }

            di.authStorage.write(creds)

            this.navigation?.onUserLoggedIn(creds)
        },

        async createNewUser() {
            this.view?.setLoading(true)

            let u: {creds: SessionCreds, loginInfo: string}
            try {
                u = await wA('creating new user failed', async () => {
                    return await di.authService.createUser()
                })
            } catch(e) {
                di.consoleBus.post(convertMaybeIntoString(e))

                return
            } finally {
                this.view?.setLoading(false)
            }

            di.authStorage.write(u.creds)
            
            this.view?.onUserCreated(u)
        }
    }
}