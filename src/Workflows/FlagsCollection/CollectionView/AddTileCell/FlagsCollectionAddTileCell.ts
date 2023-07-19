import './FlagsCollectionAddTileCell.css'
import '../DipAnimation.css'

export interface IFlagsCollectionAddTileCell {
    root: HTMLDivElement
}

export function FlagsCollectionAddTileCell(onClick: () => void): IFlagsCollectionAddTileCell {
    const cellDiv = document.createElement('div')
    
    cellDiv.className = 'flagsCollectionAddTileCell'

    cellDiv.textContent = 'Add Tile'

    let animationTimer: any
    let clickTimer: any

    cellDiv.addEventListener('click', () => {
        if (animationTimer) {
            clearTimeout(animationTimer)
        }
        if (clickTimer) {
            clearTimeout(clickTimer)
        }
        animationTimer = setTimeout(() => {
            cellDiv.classList.remove('dipAnimation')
            animationTimer = undefined
        }, 250)
        clickTimer = setTimeout(() => {
            clickTimer = undefined
            onClick()
        }, 100)
        cellDiv.classList.add('dipAnimation')
    })
    
    return {
        root: cellDiv
    }
}