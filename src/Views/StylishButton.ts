import { IThemeService, Styling } from '../Services/ThemeService'
import './StylishButton.css'

export interface IStylishButton {
    readonly root: HTMLDivElement
}

export interface StylishButtonConfig {
    readonly title: string
    readonly fontSize?: string
    readonly handler: () => void
    readonly themeService: IThemeService
}

export function StylishButton(config: StylishButtonConfig): IStylishButton {
    const div = document.createElement('div')
    div.textContent = config.title
    div.className = 'stylishButton noselect'
    div.onclick = () => {
        config.handler()
    }

    if (config.fontSize) {
        div.style.fontSize = config.fontSize
    }

    function updateStyling(styling: Styling) {
        div.style.borderColor = styling[0]
    }

    updateStyling(config.themeService.getCurrentStyling())
    config.themeService.addChangeListener(updateStyling)

    return {
        root: div
    }
}