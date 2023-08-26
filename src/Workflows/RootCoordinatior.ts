import { IDIContext } from "../Services/DI";
import { CreateUserCoordinator } from "./CreateUserController/CreateUserCoordinator";
import { FlagsCollectionCoordinator } from "./FlagsCollection/FlagsCollectionCoordinator";
import { INavigationController } from "./NavigationController/NavigationController";

export async function RootCoordinatior(
    nc: INavigationController, 
    di: IDIContext
): Promise<never> {
    if (!di.authService.userAuthIsKnown()) {
        await CreateUserCoordinator(nc, di)
    }

    return await FlagsCollectionCoordinator(di, nc)
}