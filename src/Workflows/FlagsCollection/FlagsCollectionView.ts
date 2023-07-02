import { IFlagsCollectionPresenter } from "./FlagsCollectionPresenter";
import './FlagsCollectionView.css'

const disabledBgColor = '#7575ff'
const enabledBgColor = '#5353dd'

export interface IFlagsCollectionView {
    root: HTMLDivElement
}

export function FlagsCollectionView(
    presenter: IFlagsCollectionPresenter
): IFlagsCollectionView {
    const root = document.createElement('div')
    root.className = 'flagsCollectionView'

    const flagModels = presenter.flags

    let cells = flagModels.map((flag, index) => {
        let isEnabled = flag.isEnabled
        const cellDiv = document.createElement('div')
        cellDiv.className = 'flagsCollectionCell'
        root.appendChild(cellDiv)

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
            presenter.setEnabled(index, newEnabled)
            updateStyle()
        })

        const labelNode = document.createElement('div')
        labelNode.className = 'flagsCollectionCellLabel'
        labelNode.textContent = flag.label
        cellDiv.appendChild(labelNode)
        updateStyle()

        return cellDiv
    })
    
    return {
        root: root
    }
}