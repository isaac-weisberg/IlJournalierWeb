import { IAuthDIContext, ICommonDIContext } from "../../Services/DI"
import { DevPanelPresenter } from "../DevPanel/DevPanelPresenter"
import { SendAwayLegacyMessagesPresenter } from "../DevPanel/SendAwayLegacyMessagesWidget/SendAwayLegacyMessagesPresenter"
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

    const sendAwayLegacyMessagesPresenter = SendAwayLegacyMessagesPresenter({
        themeService: di.themeService,
        moreMessagesOldLocalStorage: di.moreMessagesOldLocalStorage,
        moreMessagesStagingService: authDi.moreMessageStagingService,
        flagCollectionSessionModel: flagsCollectionSessionModel
    })

    const devPanelPresenter = DevPanelPresenter(sendAwayLegacyMessagesPresenter)
    
    const flagCollectionPresenter = FlagsCollectionPresenter(
        devPanelPresenter,
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