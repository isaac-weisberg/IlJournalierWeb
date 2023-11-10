import { IMoreMessageStagingService } from "../../Services/MoreMessagesStaging/MoreMessageStagingService"
import { IThemeService } from "../../Services/ThemeService"
import { Bus, IBus } from "../../Util/Bus"
import { DevPanelPresenter, IDevPanelPresenter } from "../DevPanel/DevPanelPresenter"
import { FlagModel, IFlagsCollectionSessionModel } from "./FlagsCollectionSessionModel"

export interface IFlagsCollectionPresenter {
    flags(): FlagModel[]
    setEnabled(id: string, enabled: boolean): void
    addFlag(id: string): FlagModel | undefined
    addMoreMessage: (value: string) => void
    onFlagsUpdated: IBus<void>,
    devPanelPresenter: IDevPanelPresenter
}

type FlagsCollectionPresenterDI = {
    flagsCollectionSessionModel: IFlagsCollectionSessionModel,
    moreMessageStagingService: IMoreMessageStagingService,
    themeService: IThemeService
}

export function FlagsCollectionPresenter(
    devPanelPresenter: IDevPanelPresenter,
    di: FlagsCollectionPresenterDI
): IFlagsCollectionPresenter {
    const flagsCollectionSessionModel = di.flagsCollectionSessionModel


    let flags = flagsCollectionSessionModel.flags()

    function getFlags(): FlagModel[] {
        return flags
    }

    function setEnabled(id: string, isEnabled: boolean) {
        const flag = flags.find((flag => { return flag.id == id }))
        if (flag) {
            flag.isEnabled = true
            flagsCollectionSessionModel.setFlagEnabled(id, isEnabled)
        }
    }

    const onFlagsUpdatedBus = Bus<void>()

    flagsCollectionSessionModel.onFlagsUpdatedBus.addHandler(() => {
        flags = flagsCollectionSessionModel.flags()
        onFlagsUpdatedBus.post()
    })

    return {
        flags: getFlags,
        setEnabled,
        addFlag(id: string): FlagModel | undefined {
            const addedFlag = flagsCollectionSessionModel.addFlag(id)
            if (addedFlag) {
                flags.push(addedFlag)
            }
            return addedFlag
        },
        addMoreMessage(value) {
            const unixSeconds = Math.round(new Date().getTime() / 1000)
            const message = {
                unixSeconds: unixSeconds,
                msg: value
            }
            di.moreMessageStagingService.stageMessage(message)
        },
        onFlagsUpdated: onFlagsUpdatedBus,
        devPanelPresenter: devPanelPresenter
    }
}