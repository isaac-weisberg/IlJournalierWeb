import './FlagsCollectionTitleBanner.css'

export interface IFlagsCollectionTitleBanner {
    readonly root: HTMLDivElement
}

export function FlagsCollectionTitleBanner(): IFlagsCollectionTitleBanner {
    const div = document.createElement('div')
    div.className = 'flagsCollectionTitleBanner noselect'
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

    return {
        root: div
    }
}
