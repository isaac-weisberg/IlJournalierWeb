import { IAuthDIContext, ICommonDIContext } from "../../Services/DI"
import { DevPanelPresenter } from "../DevPanel/DevPanelPresenter"
import { SendAwayLegacyMessagesPresenter } from "../DevPanel/SendAwayLegacyMessagesWidget/SendAwayLegacyMessagesPresenter"
import { INavigationController } from "../NavigationController/NavigationController"
import { FlagsCollectionPresenter } from "./FlagsCollectionPresenter"
import { FlagsCollectionSessionModel } from "./FlagsCollectionSessionModel"
import { FlagsCollectionViewController } from "./FlagsCollectionViewController"
import { MemoryUsageLabelPresenter } from "./MemoryUsageLabel/MemoryUsageLabelPresenter"

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
        flagCollectionSessionModel: flagsCollectionSessionModel,
        consoleBus: di.consoleBus
    })

    const devPanelPresenter = DevPanelPresenter(sendAwayLegacyMessagesPresenter)
    
    const flagCollectionPresenter = FlagsCollectionPresenter(
        devPanelPresenter,
        {
            flagsCollectionSessionModel,
            moreMessageStagingService: authDi.moreMessageStagingService,
            themeService: di.themeService,
            moreMessagesLocalBackupService: di.moreMessagesLocalBackupService
        }
    )

    const memoryLabelPresenter = MemoryUsageLabelPresenter({
        flagsDatabaseStorage: di.flagsDatabaseStorage,
        authLocalStorage: di.authLocalStorage,
        moreMessagesLocalBackupStorage: di.moreMessagesLocalBackupStorage,
        moreMessagesOldLocalStorage: di.moreMessagesOldLocalStorage,
        neverSentMessagesLocalStorage: di.neverSentMessageStorageService,
        lastIdLocalStorage: di.lastIdLocalStorage 
    })

    const flagsCollectionViewController = FlagsCollectionViewController(
        flagCollectionPresenter, 
        memoryLabelPresenter, 
        di
    )
    nc.setRootController(flagsCollectionViewController)

    return new Promise(() => {})
}