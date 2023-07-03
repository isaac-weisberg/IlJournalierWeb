import { FlagModel, IFlagsCollectionSessionModel } from "./FlagsCollectionSessionModel"

export interface IFlagsCollectionPresenter {
    readonly flags: FlagModel[]
    setEnabled(id: string, enabled: boolean): void
    handleFlagAdded(flag: FlagModel): void
}

export function FlagsCollectionPresenter(flagsCollectionSessionModel: IFlagsCollectionSessionModel): IFlagsCollectionPresenter {
    const flags = flagsCollectionSessionModel.flags()

    function setEnabled(id: string, isEnabled: boolean) {
        const flag = flags.find((flag => { return flag.id == id }))
        if (flag) {
            flag.isEnabled = true
            flagsCollectionSessionModel.setFlagEnabled(id, isEnabled)
        }
    }

    function handleFlagAdded(flag: FlagModel) {
        flags.push(flag)
    }

    return {
        flags: flags,
        handleFlagAdded,
        setEnabled
    }
}