import './CopyrightWidget.css'

export interface ICopyrightWidget {
    root: HTMLDivElement
}

export function CopyrightWidget(): ICopyrightWidget {
    const div = document.createElement('div')

    div.className = 'copy'
    div.textContent = 'first created in apr 2018'

    return {
        root: div
    }
}