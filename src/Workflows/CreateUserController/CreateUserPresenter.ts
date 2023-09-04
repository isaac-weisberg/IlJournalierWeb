import { SessionCreds } from "../../Models/SessionCreds"
import { IAuthService } from "../../Services/AuthService"
import { IAuthStorageService } from "../../Services/AuthStorageService"
import { wA } from "../../Util/ErrorExtensions"

export interface ICreateUserPresenter {
    navigation?: {
        onUserCreated: (u: { creds: SessionCreds, loginInfo: string }) => void,
        onUserLoggedIn: (u: SessionCreds) => void
    }

    view?: {
        onLoginFailed: (e: unknown) => void
        onCreateUserFailed: (e: unknown) => void
    }
    
    createNewUser(): void
    login(loginInfo: string): void
}

export function CreateUserPresenter(authService: IAuthService, authStorage: IAuthStorageService): ICreateUserPresenter {
    return {
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
                this.view?.onCreateUserFailed(e)

                return
            }

            authStorage.updateCreds(u.creds)
            
            this.navigation?.onUserCreated(u)
        }
    }
}