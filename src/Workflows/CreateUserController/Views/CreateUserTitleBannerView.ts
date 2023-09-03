import { IThemeService, Styling } from "../../../Services/ThemeService"
import './CreateUserTitleBannerView.css'

export interface ICreateUserTitleBannerView {
    root: HTMLDivElement
}

export function CreateUserTitleBannerView(themeService: IThemeService): ICreateUserTitleBannerView {
    const div = document.createElement('div')

    div.className = 'createUserTitleBannerContainer noselect'

    const label = document.createElement('div')
    label.style.overflowWrap = 'break-word'
    label.className = 'createUserTitleBannerLabel'
    label.textContent = 'IlJournalier'
    div.appendChild(label)

    div.addEventListener('click', () => {
        console.log('update theme')
        themeService.updateTheme()
    })

    themeService.addChangeListener((styling) => {
        applyStyling(styling)
    })

    function applyStyling(styling: Styling) {
        div.style.backgroundColor = styling[0]
        label.style.color = styling[1]
    }

    applyStyling(themeService.getCurrentStyling())

    return {
        root: div
    }
}