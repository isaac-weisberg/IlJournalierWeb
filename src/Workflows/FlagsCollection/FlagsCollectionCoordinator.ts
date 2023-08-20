import { IDIContext } from "../../Services/DI"
import { INavigationController } from "../NavigationController/NavigationController"
import { FlagsCollectionViewController } from "./FlagsCollectionViewController"

export async function FlagsCollectionCoordinator(
    di: IDIContext, 
    nc: INavigationController
): Promise<never> {
    const flagsCollectionViewController = FlagsCollectionViewController(di)
    nc.setRootController(flagsCollectionViewController)

    return new Promise(() => {})
}