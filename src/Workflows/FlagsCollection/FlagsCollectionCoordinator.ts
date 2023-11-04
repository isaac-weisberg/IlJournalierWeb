import { IAuthDIContext, ICommonDIContext } from "../../Services/DI"
import { INavigationController } from "../NavigationController/NavigationController"
import { FlagsCollectionPresenter } from "./FlagsCollectionPresenter"
import { FlagsCollectionSessionModel } from "./FlagsCollectionSessionModel"
import { FlagsCollectionViewController } from "./FlagsCollectionViewController"

export async function FlagsCollectionCoordinator(
    di: ICommonDIContext,
    authDi: IAuthDIContext,
    nc: INavigationController
): Promise<never> {
    const flagsCollectionSessionModel = FlagsCollectionSessionModel(di)
    
    const flagCollectionPresenter = FlagsCollectionPresenter(flagsCollectionSessionModel, authDi.moreMessageStagingService)

    const flagsCollectionViewController = FlagsCollectionViewController(flagCollectionPresenter, di)
    nc.setRootController(flagsCollectionViewController)

    return new Promise(() => {})
}