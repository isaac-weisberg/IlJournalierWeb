import { IThemeService, Styling } from '../Services/ThemeService'
import './StylishTextInput.css'

export interface IStylishTextInput {
    setValue(value: string): void
    value(): string
    reset(): void
    readonly root: HTMLInputElement
}

export interface StylishTextInputConfig {
    overridePlaceholder: string|undefined
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

    if (config.overridePlaceholder != undefined) {
        input.placeholder = config.overridePlaceholder
    } else {
        const possiblePlaceholders = [ 
            'Suicidal', 
            'Ate chocolate', 
            'Played Dark Souls', 
            'Drank',
            'Ел fromage',
            'Занимался дрифтингом',
            'Занимался фистингом',
            'Omelette du fromage',
            'Beatles - You never give me your money',
            'Ju bli\'e mo cha\'e'
        ]
        const placeholder = possiblePlaceholders[Math.floor(Math.random() * possiblePlaceholders.length)];
        input.placeholder = placeholder
    }

    function updateStyling(styling: Styling) {
        input.style.borderColor = styling[0]
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