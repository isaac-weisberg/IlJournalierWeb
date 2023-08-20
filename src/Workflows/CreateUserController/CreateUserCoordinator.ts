import { IDIContext } from "../../Services/DI"
import { Deferred } from "../../Util/Deferred"
import { INavigationController } from "../NavigationController/NavigationController"
import { CreateUserController } from "./CreateUserController"

export async function CreateUserCoordinator(
    nc: INavigationController, 
    di: IDIContext
) {
    const createUserController = CreateUserController(di)
    nc.setRootController(createUserController)

    const deferred = Deferred<never>()
    return deferred.promise
}