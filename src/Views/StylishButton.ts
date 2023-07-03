import './StylishButton.css'

export interface IStylishButton {
    readonly root: HTMLDivElement
}

export function StylishButton(title: string, handler: () => void): IStylishButton {
    const div = document.createElement('div')
    div.textContent = title
    div.className = 'stylishButton'
    div.onclick = () => {
        handler()
    }

    return {
        root: div
    }
}