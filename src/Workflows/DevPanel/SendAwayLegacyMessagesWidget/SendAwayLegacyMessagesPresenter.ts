import { IMoreMessagesOldLocalStorage } from "../../../Services/MoreMessagesOld/MoreMessagesOldDatabaseLocalStorage"
import { IMoreMessageStagingService } from "../../../Services/MoreMessagesStaging/MoreMessageStagingService"
import { IThemeService } from "../../../Services/ThemeService"

export interface ISendAwayLegacyMessagesPresenter {
    sendAwayLegacyMessages(): Promise<void>
    themeService: IThemeService
}

export function SendAwayLegacyMessagesPresenter(
    di: {
        moreMessagesOldLocalStorage: IMoreMessagesOldLocalStorage,
        moreMessagesStagingService: IMoreMessageStagingService,
        themeService: IThemeService
    }
): ISendAwayLegacyMessagesPresenter {
    let isLoading = false

    return {
        themeService: di.themeService,
        async sendAwayLegacyMessages() {

            if (isLoading) {
                return
            }
            isLoading = true
            const oldEntries = di.moreMessagesOldLocalStorage.read()

            if (!oldEntries) {
                alert('nothing to send')
                isLoading = false
                return
            }

            let messagesToSend: {
                msg: string,
                unixSeconds: number
            }[] = []
            
            let iterationCount = -1
            for (const key in oldEntries.messages) {
                iterationCount++

                const unixMilliseconds = Number(key)


                if (isNaN(unixMilliseconds)) {
                    alert(`unreachabe ${key} idx: ${iterationCount}`)
                    isLoading = false
                    return
                }
                
                const message = oldEntries.messages[key]
                const unixSeconds = Math.round(unixMilliseconds / 1000)

                // console.log(`Millis ${unixMilliseconds}, sex: ${unixSeconds}`)

                messagesToSend.push({
                    unixSeconds: unixSeconds, 
                    msg: message
                })
            }

            if (messagesToSend.length == 0) {
                alert('nothing to send really')
                isLoading = false
                return
            }

            await di.moreMessagesStagingService.stageMultipleLegacyMessages(messagesToSend)
        }
    }
}
