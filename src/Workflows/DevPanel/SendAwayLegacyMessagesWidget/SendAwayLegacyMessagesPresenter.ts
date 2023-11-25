import { IMoreMessagesOldLocalStorage } from "../../../Services/MoreMessagesOld/MoreMessagesOldDatabaseLocalStorage"
import { IMoreMessageStagingService } from "../../../Services/MoreMessagesStaging/MoreMessageStagingService"
import { IThemeService } from "../../../Services/ThemeService"
import { convertMaybeIntoString, wA } from "../../../Util/ErrorExtensions"
import { IFlagsCollectionSessionModel } from "../../FlagsCollection/FlagsCollectionSessionModel"

export interface ISendAwayLegacyMessagesPresenter {
    sendAwayLegacyMessages(): Promise<void>
    themeService: IThemeService
}

export function SendAwayLegacyMessagesPresenter(
    di: {
        moreMessagesOldLocalStorage: IMoreMessagesOldLocalStorage,
        moreMessagesStagingService: IMoreMessageStagingService,
        themeService: IThemeService,
        flagCollectionSessionModel: IFlagsCollectionSessionModel
    }
): ISendAwayLegacyMessagesPresenter {
    async function kobe() {
        const oldEntries = di.moreMessagesOldLocalStorage.read()

        if (!oldEntries) {
            alert('nothing to send')
            return
        }

        let messagesToSend: {
            msg: string,
            unixSeconds: number
        }[]
        
        // Super-legacy messages database
        messagesToSend = di.flagCollectionSessionModel.getLegacyMessages()

        // Separate moreMessages old database
        let iterationCount = -1
        for (const key in oldEntries.messages) {
            iterationCount++

            const unixMilliseconds = Number(key)

            if (isNaN(unixMilliseconds)) {
                alert(`MoreMessagesOldDB: unreachabe ${key} idx: ${iterationCount}`)
                return
            }
            
            const message = oldEntries.messages[key]
            const unixSeconds = Math.round(unixMilliseconds / 1000)

            messagesToSend.push({
                unixSeconds: unixSeconds, 
                msg: message
            })
        }

        if (messagesToSend.length == 0) {
            alert('nothing to send really')
            return
        }

        try {
            await wA('agressiveSendLegacyMessages failed', async () => {
                return await di.moreMessagesStagingService.aggressiveSendLegacyMessages(messagesToSend)
            })
        } catch(e) {
            console.error(convertMaybeIntoString(e))
            alert(convertMaybeIntoString(e))
            return
        }


        // success, let's bomb that bitch
        di.moreMessagesOldLocalStorage.remove()
        di.flagCollectionSessionModel.nukeLegacyMessages()
        di.moreMessagesStagingService.localSaveLegacyMessages(messagesToSend)
    }

    let isLoading = false

    return {
        themeService: di.themeService,
        async sendAwayLegacyMessages() {
            if (isLoading) {
                return
            }
            isLoading = true
            await kobe()
            isLoading = false
        },
    }
}
