import { SessionCreds } from "../../Models/SessionCreds"
import { IAuthStorageService } from "../../Services/AuthStorageService"
import { sleep } from "../../Util/Sleep"

export interface ICreateUserPresenter {
    navigation?: {
        onUserCreated: (u: { creds: SessionCreds, magicKey: string }) => void,
        onUserLoggedIn: (u: SessionCreds) => void
    }
    
    createNewUser(): void
    login(loginInfo: string): void
}

export function CreateUserPresenter(authService: IAuthStorageService): ICreateUserPresenter {
    return {
        async login(loginInfo) {
            
        },

        async createNewUser() {
            await sleep(2000)

            const newUuid = self.crypto.randomUUID()

            const userData = {
                creds: {
                    accessToken: 'as[dofnvmq[eonrv[oqiwemc[pkadnfmv[oiqned',
                    saultGoodman: 'newUuid'
                },
                magicKey: 'magic_key_fuck',
            }
            

            this.navigation?.onUserCreated(userData)

        }
    }
}