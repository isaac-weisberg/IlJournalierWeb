import { IThemeService, Styling } from '../Services/ThemeService'
import './StylishTextInput.css'

export interface IStylishTextInput {
    setValue(value: string): void
    value(): string
    reset(): void
    readonly root: HTMLInputElement
}

export interface StylishTextInputConfig {
    placeholder: string
    fontSize?: string
    readOnly: boolean,
    themeService: IThemeService
}

export function StylishTextInput(config: StylishTextInputConfig): IStylishTextInput {
    const input = document.createElement('input')
    input.className = 'stylishTextInput'
    if (config.fontSize) {
        input.style.fontSize = config.fontSize
    }

    input.readOnly = config.readOnly

    input.placeholder = config.placeholder

    function updateStyling(styling: Styling) {
        input.style.borderBottomColor = styling[0]
    }

    const themeService = config.themeService

    updateStyling(themeService.getCurrentStyling())
    themeService.addChangeListener(updateStyling)

    return {
        setValue(value) {
            input.value = value
        },
        value() {
            return input.value
        },
        reset() {
            input.value = ''
        },
        root: input
    }
}