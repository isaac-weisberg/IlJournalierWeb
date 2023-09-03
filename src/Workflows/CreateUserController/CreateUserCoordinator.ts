import { SessionCreds } from "../../Models/SessionCreds"
import { IDIContext } from "../../Services/DI"
import { Deferred } from "../../Util/Deferred"
import { MagicKeyViewerCoordinator } from "../MagicKeyViewerController/MagicKeyViewerCoordinator"
import { INavigationController } from "../NavigationController/NavigationController"
import { CreateUserController } from "./CreateUserController"
import { CreateUserPresenter } from "./CreateUserPresenter"

export async function CreateUserCoordinator(
    nc: INavigationController, 
    di: IDIContext
): Promise<SessionCreds> {
    const presenter = CreateUserPresenter(di.authService)

    const createUserController = CreateUserController(presenter, di)
    nc.setRootController(createUserController)

    const finish = Deferred<SessionCreds>()

    presenter.onUserCreated = async (u) => {
        await MagicKeyViewerCoordinator(u, nc, di)

        finish.resolve({accessToken: u.accessToken})
    }

    return finish.promise
}