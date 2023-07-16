import { IFlagsDatabaseStorageService } from "../../Services/FlagsDatabaseStorageServiceV1"
import { IStoragePersistanceService } from "../../Services/StoragePersistanceService"
import { IThemeService } from "../../Services/ThemeService"
import { StylishButton } from "../../Views/StylishButton"
import { StylishTextInput } from "../../Views/StylishTextInput"
import './DevPanel.css'

export interface IDevPanel {
    root: HTMLDivElement
}



export function DevPanel(
    themeService: IThemeService, 
    flagsDbService: IFlagsDatabaseStorageService, 
    persistenceService: IStoragePersistanceService
): IDevPanel {
    const div = document.createElement('div')

    div.className = 'devPanelContainer'

    function addDevWidgets() {
        // const rawDbTextField = StylishTextInput({ overridePlaceholder: 'Raw Flags DB' }, themeService)
    
        // const loadDbSchemaV1Button  = StylishButton('Load Flags DB', themeService, () => {
        //     const rawDb = flagsDbService.dumpRawDatabase()
        //     rawDbTextField.setValue(rawDb || '')
        // })
    
        // const saveDbSchemaV1Button = StylishButton('Save Flags DB', themeService, () => {
        //     const value = rawDbTextField.value()
        //     flagsDbService.overrideRawDatabase(value)
        // })

        // div.appendChild(loadDbSchemaV1Button.root)
        // div.appendChild(saveDbSchemaV1Button.root)
        // div.appendChild(rawDbTextField.root)

        const loadingText = '... loading ...'
        const currentPersistenceStatusInput = StylishTextInput({ overridePlaceholder: '-' }, themeService)
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

        const requestPersistenceButton = StylishButton('Request persistence', themeService, async () => {
            if (!persistenceRequestBusy) {
                persistenceRequestBusy = true
                currentPersistenceStatusInput.setValue(loadingText)
                
                const persistent = await persistenceService.requestPersistence()

                currentPersistenceStatusInput.setValue(isPersistedToString(persistent))
                persistenceRequestBusy = false
            }
        })

        div.appendChild(currentPersistenceStatusInput.root)
        div.appendChild(requestPersistenceButton.root)
    }

    let devButtonTapped = 0
    const devButton = StylishButton('devmode', themeService, () => {
        devButtonTapped += 1

        if (devButtonTapped == 10) {
            addDevWidgets()
        }
    })

    div.appendChild(devButton.root)

    return {
        root: div
    }
}