import { Opt } from "../../Util/Opt"
import { sleep } from "../../Util/Sleep"

export interface ICreateUserPresenter {
    onUserCreated: Opt<(p: {magicKey: string, accessToken: string}) => void>
    createNewUser(): void
}

export function CreateUserPresenter(): ICreateUserPresenter {
    return {
        onUserCreated: undefined,
        
        async createNewUser() {
            await sleep(2000)

            if (this.onUserCreated) {
                this.onUserCreated({
                    magicKey: 'magic_key_fuck', 
                    accessToken: 'as[dofnvmq[eonrv[oqiwemc[pkadnfmv[oiqned'
                })
            }

        }
    }
}