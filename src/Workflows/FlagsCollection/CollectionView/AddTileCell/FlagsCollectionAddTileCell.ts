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

    cellDiv.addEventListener('click', () => {
        if (animationTimer) {
            clearTimeout(animationTimer)
        }
        animationTimer = setTimeout(() => {
            cellDiv.classList.remove('dipAnimation')
            animationTimer = undefined
        }, 250)
        cellDiv.classList.add('dipAnimation')
        onClick()
    })
    
    return {
        root: cellDiv
    }
}