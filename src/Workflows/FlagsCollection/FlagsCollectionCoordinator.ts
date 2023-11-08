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
    
    const flagCollectionPresenter = FlagsCollectionPresenter(
        {
            flagsCollectionSessionModel, 
            moreMessageStagingService: authDi.moreMessageStagingService, 
            themeService: di.themeService
        }
    )

    const flagsCollectionViewController = FlagsCollectionViewController(flagCollectionPresenter, di)
    nc.setRootController(flagsCollectionViewController)

    return new Promise(() => {})
}