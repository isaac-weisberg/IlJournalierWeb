import { AppVersion } from "../../Services/AppVersion"
import { ICommonDIContext } from "../../Services/DI"
import { StylishButton } from "../../Views/StylishButton"
import { StylishTextInput } from "../../Views/StylishTextInput"
import './DevPanel.css'
import { IDevPanelPresenter } from "./DevPanelPresenter"
import { ReadWriteDbWidget } from "./ReadWriteDbWidget"
import { SendAwayLegacyMessagesWidget } from "./SendAwayLegacyMessagesWidget/SendAwayLegacyMessagesWidget"

export interface IDevPanel {
    root: HTMLDivElement
}

export function DevPanel(
    presenter: IDevPanelPresenter,
    diContext: ICommonDIContext
): IDevPanel {
    const div = document.createElement('div')

    div.className = 'devPanelContainer'

    function addDevWidgets() {
        const flagsRWWidget = ReadWriteDbWidget('FlagsDB', {
            readString: diContext.flagsDatabaseStorage.readRaw,
            writeString: diContext.flagsDatabaseStorage.writeRaw
        }, diContext.themeService)
        div.appendChild(flagsRWWidget.root)

        const moreMsgsRWWidget = ReadWriteDbWidget('MoreMsgsDB', {
            readString: diContext.moreMessagesOldLocalStorage.readRaw,
            writeString: diContext.moreMessagesOldLocalStorage.writeRaw
        }, diContext.themeService)
        div.appendChild(moreMsgsRWWidget.root)

        const loadingText = '... loading ...'
        const currentPersistenceStatusInput = StylishTextInput({ 
            placeholder: '-',
            fontSize: '120%',
            readOnly: true,
            themeService: diContext.themeService
        })
        currentPersistenceStatusInput.setValue(loadingText)
        let persistenceRequestBusy = true

        function isPersistedToString(persistent: boolean): string {
            let newValue: string
            if (persistent) {
                newValue = 'Persistent! Very gud!'
            } else {
                newValue = 'Not persistent :('
            }
            return newValue
        }

        diContext.persistenceApiService.isPersisted().then((persistent) => {
            currentPersistenceStatusInput.setValue(isPersistedToString(persistent))
            persistenceRequestBusy = false
        })

        const requestPersistenceButton = StylishButton({ 
            title: 'Request persistence', 
            themeService: diContext.themeService,
            fontSize: '150%',
            handler: async () => {
                if (!persistenceRequestBusy) {
                    persistenceRequestBusy = true
                    currentPersistenceStatusInput.setValue(loadingText)
                    
                    const persistent = await diContext.persistenceApiService.requestPersistence()

                    currentPersistenceStatusInput.setValue(isPersistedToString(persistent))
                    persistenceRequestBusy = false
                }
            }
        })

        div.appendChild(currentPersistenceStatusInput.root)
        div.appendChild(requestPersistenceButton.root)

        const sendAwayLegacyMessagesWidget = SendAwayLegacyMessagesWidget(presenter.sendAwayLegacyMessagesPresenter)

        div.appendChild(sendAwayLegacyMessagesWidget.div)
    }

    let devButtonTapped = 0
    const devButton = StylishButton({ 
        title: 'devmode',
        themeService: diContext.themeService, 
        handler: () => {
            devButtonTapped += 1

            if (devButtonTapped == 10) {
                addDevWidgets()
            }
        }
    })

    div.appendChild(devButton.root)

    const appVersionWidget = document.createElement('div')
    appVersionWidget.textContent = `ver ${AppVersion}`
    div.appendChild(appVersionWidget)

    return {
        root: div
    }
}