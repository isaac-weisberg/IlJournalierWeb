import { SessionCreds } from "../../Models/SessionCreds"
import { ICommonDIContext } from "../../Services/DI"
import { INavigationController } from "../NavigationController/NavigationController"
import { FlagsCollectionPresenter } from "./FlagsCollectionPresenter"
import { FlagsCollectionSessionModel } from "./FlagsCollectionSessionModel"
import { FlagsCollectionViewController } from "./FlagsCollectionViewController"

export async function FlagsCollectionCoordinator(
    creds: SessionCreds,
    di: ICommonDIContext, 
    nc: INavigationController
): Promise<never> {
    const flagsCollectionSessionModel = FlagsCollectionSessionModel(di)
    
    const flagCollectionPresenter = FlagsCollectionPresenter(flagsCollectionSessionModel)

    const flagsCollectionViewController = FlagsCollectionViewController(flagCollectionPresenter, di)
    nc.setRootController(flagsCollectionViewController)

    return new Promise(() => {})
}