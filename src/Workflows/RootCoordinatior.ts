import { IDIContext } from "../Services/DI";
import { CreateUserCoordinator } from "./CreateUserController/CreateUserCoordinator";
import { FlagsCollectionCoordinator } from "./FlagsCollection/FlagsCollectionCoordinator";
import { INavigationController } from "./NavigationController/NavigationController";

export async function RootCoordinatior(
    nc: INavigationController, 
    di: IDIContext
): Promise<never> {
    let existingCreds = di.authStorageService.getExistingSessionCreds()

    if (!existingCreds) {
        existingCreds = await CreateUserCoordinator(nc, di)
    }

    return await FlagsCollectionCoordinator(existingCreds, di, nc)
}