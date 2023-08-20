import { IDIContext } from "../Services/DI";
import { FlagsCollectionCoordinator } from "./FlagsCollection/FlagsCollectionCoordinator";
import { INavigationController } from "./NavigationController/NavigationController";

export async function RootCoordinatior(
    nc: INavigationController, 
    di: IDIContext
): Promise<never> {
    // const shouldShowCreateUser = false

    // if (shouldShowCreateUser) {
    //     await CreateUserCoordinator(nc, di)
    // }

    return await FlagsCollectionCoordinator(di, nc)
}