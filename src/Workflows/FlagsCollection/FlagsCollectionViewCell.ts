import { FlagModel } from "./FlagsCollectionSessionModel"
import './FlagsCollectionViewCell.css'


const enabledBgColor = '#D5A6A7'
const disabledBgColor = '#F7CAC9'

export interface IFlagsCollectionViewCell {
    readonly root: HTMLDivElement
}

export function FlagsCollectionViewCell(
    flag: FlagModel,
    onSetEnabled: (id: string, enabled: boolean) => void
): IFlagsCollectionViewCell {
    let isEnabled = flag.isEnabled
    const cellDiv = document.createElement('div')
    cellDiv.className = 'flagsCollectionCell noselect'

    function updateStyle() {
        const newColor = isEnabled 
            ? enabledBgColor
            : disabledBgColor
        cellDiv.style.backgroundColor = newColor
    }
    
    let animationTimer: any

    cellDiv.addEventListener('click', () => {
        if (animationTimer) {
            clearTimeout(animationTimer)
        }
        animationTimer = setTimeout(() => {
            cellDiv.classList.remove('dipAnimation')
            animationTimer = undefined
        }, 250)
        cellDiv.classList.add('dipAnimation')
        const newEnabled = !isEnabled
        isEnabled = newEnabled
        onSetEnabled(flag.id, newEnabled)
        updateStyle()
    })

    const labelNode = document.createElement('div')
    labelNode.className = 'flagsCollectionCellLabel'
    labelNode.textContent = flag.id
    labelNode.style.color = 'black'
    cellDiv.appendChild(labelNode)
    updateStyle()
    
    return {
        root: cellDiv
    }
}