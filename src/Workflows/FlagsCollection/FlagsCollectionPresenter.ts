import { IFlagsCollectionSessionModel } from "./FlagsCollectionSessionModel"

export interface FlagModel {
    id: string
    isEnabled: boolean
}

export interface IFlagsCollectionPresenter {
    readonly flags: FlagModel[]
    setEnabled(id: string, enabled: boolean): void
}

export function FlagsCollectionPresenter(flagsCollectionSessionModel: IFlagsCollectionSessionModel): IFlagsCollectionPresenter {

    const flags = flagsCollectionSessionModel.flags()

    return {
        flags: flags,
        setEnabled(id, isEnabled) {
            const flag = flags.find((flag => { return flag.id == id }))
            if (flag) {
                flag.isEnabled = true
                flagsCollectionSessionModel.setFlagEnabled(id, isEnabled)
            }
        }
    }
}