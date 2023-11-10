import { IAuthLocalStorage } from "../../../Services/Auth/AuthLocalStorage";
import { IFlagsDatabaseLocalStorage } from "../../../Services/FlagsDatabase/FlagsDatabaseLocalStorage";
import { ILastIdLocalStorage } from "../../../Services/MoreMessageLocalIdService/LocalLastIdDatabase";
import { IMoreMessagesLocalBackupStorage } from "../../../Services/MoreMessagesLocalBackup.ts/MoreMessagesLocalBackupStorage";
import { IMoreMessagesOldLocalStorage } from "../../../Services/MoreMessagesOld/MoreMessagesOldDatabaseLocalStorage";
import { INeverSentMessagesLocalStorage } from "../../../Services/NeverSentMessages/NeverSentMessagesLocalStorage";
import { Bus, IBus } from "../../../Util/Bus";

export interface IMemoryUsageLabelPresenter {
    memoryUsageChangedBus: IBus<number|undefined>
    calculateAndUpdate(): void
}

export function MemoryUsageLabelPresenter(
    di: {
        flagsDatabaseStorage: IFlagsDatabaseLocalStorage,
        moreMessagesOldLocalStorage: IMoreMessagesOldLocalStorage,
        authLocalStorage: IAuthLocalStorage,
        neverSentMessagesLocalStorage: INeverSentMessagesLocalStorage,
        moreMessagesLocalBackupStorage: IMoreMessagesLocalBackupStorage,
        lastIdLocalStorage: ILastIdLocalStorage
    }
): IMemoryUsageLabelPresenter {
    const bus = Bus<number|undefined>()
    
    let knownLengths: (number|undefined)[] = []

    function totalKnownLength() {
        let total: number|undefined
        for (const value of knownLengths) {
            if (value) {
                if (total) {
                    total += value
                } else {
                    total = value
                }
            }
        }
        return total
    }

    function calcAndUpdateText() {
        const length = totalKnownLength()
        bus.post(length)
    }

    [
        di.flagsDatabaseStorage,
        di.moreMessagesOldLocalStorage,
        di.authLocalStorage,
        di.neverSentMessagesLocalStorage,
        di.moreMessagesLocalBackupStorage,
        di.lastIdLocalStorage
    ].forEach((localStorage, index) => {
        knownLengths[index] = localStorage.getCurrentStorageLength()

        localStorage.setCurrentStorageChangedHandler((length) => {
            knownLengths[index] = length
            calcAndUpdateText()
        })
    })

    return {
        memoryUsageChangedBus: bus,
        calculateAndUpdate() {
            calcAndUpdateText()
        }
    }
}