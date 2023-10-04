import { SessionCreds } from "../../../Models/SessionCreds"
import { IDIContext } from "../../../Services/DI"
import { Deferred } from "../../../Util/Deferred"
import { INavigationController } from "../../NavigationController/NavigationController"
import { CreateUserController } from "./CreateUserController"
import { CreateUserPresenter } from "./CreateUserPresenter"

export async function CreateUserCoordinator(
    nc: INavigationController, 
    di: IDIContext
): Promise<SessionCreds> {
    const presenter = CreateUserPresenter(di.authService, di.authStorageService)

    const createUserController = CreateUserController(presenter, di)
    nc.setRootController(createUserController)

    const finish = Deferred<SessionCreds>()

    presenter.navigation = {
        async onUserLoggedIn(creds) {
            finish.resolve(creds)
        },
    }
    
    return finish.promise
}