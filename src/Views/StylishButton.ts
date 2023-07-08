import { IThemeService, Styling } from '../Services/ThemeService'
import './StylishButton.css'

export interface IStylishButton {
    readonly root: HTMLDivElement
}

export function StylishButton(title: string, themeService: IThemeService, handler: () => void): IStylishButton {
    const div = document.createElement('div')
    div.textContent = title
    div.className = 'stylishButton noselect'
    div.onclick = () => {
        handler()
    }

    function updateStyling(styling: Styling) {
        div.style.borderColor = styling[0]
    }

    updateStyling(themeService.getCurrentStyling())
    themeService.addChangeListener(updateStyling)

    return {
        root: div
    }
}