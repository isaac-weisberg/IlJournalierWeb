import { IThemeService, Styling } from '../../Services/ThemeService'
import './FlagsCollectionTitleBanner.css'

export interface IFlagsCollectionTitleBanner {
    readonly root: HTMLDivElement
}

export function FlagsCollectionTitleBanner(message: string|undefined, themeService: IThemeService): IFlagsCollectionTitleBanner {
    const div = document.createElement('div')
    div.className = 'flagsCollectionTitleBanner noselect'
    if (message) {
        div.textContent = message    
    } else {
        const tiltes = [
            'TILES',
            'ALL GOOD?',
            'HELP',
            'ДЕРЖИСЬ',
            'IlJournalier',
            'Caroline',
            'Portal 2',
            'Новосибирск -27',
            'Киев -3',
            'HOLD ON\'E',
            'FROMAGE',
            'MERDE',
            'OMELETTE'
        ]
        const title =  tiltes[Math.floor(Math.random() * tiltes.length)];
        div.textContent = title
    }

    function updateStyling(styling: Styling) {
        div.style.backgroundColor = styling[0]
        div.style.color = styling[1]
    }

    updateStyling(themeService.getCurrentStyling())
    themeService.addChangeListener(updateStyling)

    div.addEventListener('click', () => {
        themeService.updateTheme()
    })

    return {
        root: div
    }
}
