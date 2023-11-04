import { IMoreMessageStagingService } from "../../Services/MoreMessages/MoreMessageStagingService"
import { IStagedMessageStorage } from "../../Services/MoreMessages/StagedMessageStorage"
import { Bus, IBus } from "../../Util/Bus"
import { FlagModel, IFlagsCollectionSessionModel } from "./FlagsCollectionSessionModel"

export interface IFlagsCollectionPresenter {
    flags(): FlagModel[]
    setEnabled(id: string, enabled: boolean): void
    addFlag(id: string): FlagModel | undefined
    addMoreMessage: (value: string) => void
    onFlagsUpdated: IBus<void>
}

export function FlagsCollectionPresenter(
    flagsCollectionSessionModel: IFlagsCollectionSessionModel,
    moreMessageStagingService: IMoreMessageStagingService
): IFlagsCollectionPresenter {
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
            moreMessageStagingService.stageMessage({
                unixSeconds: unixSeconds,
                msg: value
            })
            flagsCollectionSessionModel.addMoreMessage(value)
        },
        onFlagsUpdated: onFlagsUpdatedBus
    }
}