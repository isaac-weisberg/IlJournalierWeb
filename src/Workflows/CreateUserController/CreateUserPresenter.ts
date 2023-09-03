import { IAuthService } from "../../Services/AuthService"
import { Opt } from "../../Util/Opt"
import { sleep } from "../../Util/Sleep"

export interface ICreateUserPresenter {
    onUserCreated: Opt<(p: {magicKey: string, accessToken: string, saultGoodman: string}) => void>
    createNewUser(): void
}

export function CreateUserPresenter(authService: IAuthService): ICreateUserPresenter {
    return {
        onUserCreated: undefined,
        
        async createNewUser() {
            await sleep(2000)

            const userData = {
                magicKey: 'magic_key_fuck', 
                accessToken: 'as[dofnvmq[eonrv[oqiwemc[pkadnfmv[oiqned',
                saultGoodman: 'asofknvq[eirnv[iebnr[ovnae[ojvnqer'
            }

            authService.logIntoANewUser({accessToken: userData.accessToken})

            if (this.onUserCreated) {
                this.onUserCreated(userData)
            }

        }
    }
}