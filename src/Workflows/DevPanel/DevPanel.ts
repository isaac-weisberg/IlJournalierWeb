import { IFlagsDatabaseStorageService } from "../../Services/FlagsDatabaseStorageServiceV1"
import { IMoreMessagesStorageService } from "../../Services/MoreMessagesStorageService"
import { IStoragePersistanceService } from "../../Services/StoragePersistanceService"
import { IThemeService } from "../../Services/ThemeService"
import { StylishButton } from "../../Views/StylishButton"
import { StylishTextInput } from "../../Views/StylishTextInput"
import './DevPanel.css'
import { ReadWriteDbWidget } from "./ReadWriteDbWidget"

export interface IDevPanel {
    root: HTMLDivElement
}

export function DevPanel(
    themeService: IThemeService, 
    flagsDbService: IFlagsDatabaseStorageService,
    moreMsgsDbService: IMoreMessagesStorageService,
    persistenceService: IStoragePersistanceService
): IDevPanel {
    const div = document.createElement('div')

    div.className = 'devPanelContainer'

    function addDevWidgets() {
        const flagsRWWidget = ReadWriteDbWidget('FlagsDB', {
            readString: flagsDbService.dumpRawDatabase,
            writeString: flagsDbService.overrideRawDatabase
        }, themeService)
        div.appendChild(flagsRWWidget.root)

        const moreMsgsRWWidget = ReadWriteDbWidget('MoreMsgsDB', {
            readString: moreMsgsDbService.dumpRawDatabase,
            writeString: moreMsgsDbService.overrideRawDatabase
        }, themeService)
        div.appendChild(moreMsgsRWWidget.root)

        const loadingText = '... loading ...'
        const currentPersistenceStatusInput = StylishTextInput({ 
            overridePlaceholder: '-',
            fontSize: '120%'
        }, themeService)
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

        persistenceService.isPersisted().then((persistent) => {
            currentPersistenceStatusInput.setValue(isPersistedToString(persistent))
            persistenceRequestBusy = false
        })

        const requestPersistenceButton = StylishButton({ 
            title: 'Request persistence', 
            themeService,
            fontSize: '150%',
            handler: async () => {
                if (!persistenceRequestBusy) {
                    persistenceRequestBusy = true
                    currentPersistenceStatusInput.setValue(loadingText)
                    
                    const persistent = await persistenceService.requestPersistence()

                    currentPersistenceStatusInput.setValue(isPersistedToString(persistent))
                    persistenceRequestBusy = false
                }
            }
        })

        div.appendChild(currentPersistenceStatusInput.root)
        div.appendChild(requestPersistenceButton.root)
    }

    let devButtonTapped = 0
    const devButton = StylishButton({ 
        title: 'devmode', 
        themeService, 
        handler: () => {
            devButtonTapped += 1

            if (devButtonTapped == 10) {
                addDevWidgets()
            }
        }
    })

    div.appendChild(devButton.root)

    return {
        root: div
    }
}