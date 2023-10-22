import './Spinner.css'

export interface ISpinner {
    root: HTMLDivElement
}

export function Spinner(): ISpinner {
    const root = document.createElement('div')
    root.className = 'spinnorContainer'

    const backgroungLayer = document.createElement('div')
    backgroungLayer.className = 'spinnorBg'

    root.appendChild(backgroungLayer)

    const spinnerEnclosure = document.createElement('div')
    spinnerEnclosure.className = 'spinningEnclosureContainer'
    root.appendChild(spinnerEnclosure)

    const animatedElement = document.createElement('div')
    animatedElement.textContent = '/'
    animatedElement.className = 'spinnor'
    spinnerEnclosure.appendChild(animatedElement)

    return {
        root
    }
}