import { AuthDIContext, ICommonDIContext } from "../Services/DI";
import { CreateUserCoordinator } from "./Auth/CreateUserController/CreateUserCoordinator";
import { FlagsCollectionCoordinator } from "./FlagsCollection/FlagsCollectionCoordinator";
import { INavigationController } from "./NavigationController/NavigationController";

export async function RootCoordinatior(
    nc: INavigationController, 
    di: ICommonDIContext
): Promise<never> {
    let existingCreds = di.authLocalStorage.read()

    if (!existingCreds) {
        existingCreds = await CreateUserCoordinator(nc, di)
    }

    const authDi = AuthDIContext(di, existingCreds)

    return await FlagsCollectionCoordinator(di, authDi, nc)
}