import { FlagsCollectionService, IFlagsCollectionService } from "./FlagsCollectionService"

export interface FlagModel {
    label: string
    isEnabled: boolean
}

export interface IFlagsCollectionPresenter {
    readonly flags: FlagModel[]
    setEnabled(idx: number, enabled: boolean): void
}

export function FlagsCollectionPresenter(flagsCollectionService: IFlagsCollectionService): IFlagsCollectionPresenter {
    // function makeid(length: number) {
    //     let result = '';
    //     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     const charactersLength = characters.length;
    //     let counter = 0;
    //     while (counter < length) {
    //       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    //       counter += 1;
    //     }
    //     return result;
    // }

    // const randomFlagNames = Array.from(Array(10).keys()).map(idx => {
    //     return [
    //         makeid(7),
    //         makeid(3),
    //         makeid(11)
    //     ].join(', ')
    // })

    // const flags = randomFlagNames.map(name => {
    //     return {
    //         label: name,
    //         isEnabled: false
    //     }
    // })


    const flags = flagsCollectionService.flags
    return {
        flags: flags,
        setEnabled(index, isEnabled) {
            flags[index].isEnabled = isEnabled
            flagsCollectionService.setEnabled(index, isEnabled)
        }
    }
}