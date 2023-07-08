import { IFlagsDatabaseStorageService } from "../../Services/FlagsDatabaseStorageServiceV1"
import { IThemeService } from "../../Services/ThemeService"
import { StylishButton } from "../../Views/StylishButton"
import { StylishTextInput } from "../../Views/StylishTextInput"
import './DevPanel.css'

export interface IDevPanel {
    root: HTMLDivElement
}

export function DevPanel(themeService: IThemeService, flagsDbService: IFlagsDatabaseStorageService): IDevPanel {
    const div = document.createElement('div')

    div.className = 'devPanelContainer'

    const rawDbTextField = StylishTextInput({ overridePlaceholder: 'Raw Flags DB' }, themeService)

    const loadDbSchemaV1Button  = StylishButton('Load Flags DB', themeService, () => {
        const rawDb = flagsDbService.dumpRawDatabase()
        rawDbTextField.setValue(rawDb || '')
    })

    const saveDbSchemaV1Button = StylishButton('Save Flags DB', themeService, () => {
        const value = rawDbTextField.value()
        flagsDbService.overrideRawDatabase(value)
    })

    let devButtonTapped = 0
    const devButton = StylishButton('devmode', themeService, () => {
        devButtonTapped += 1

        if (devButtonTapped == 10) {
            div.appendChild(loadDbSchemaV1Button.root)
            div.appendChild(saveDbSchemaV1Button.root)
            div.appendChild(rawDbTextField.root)
        }
    })

    div.appendChild(devButton.root)

    return {
        root: div
    }
}