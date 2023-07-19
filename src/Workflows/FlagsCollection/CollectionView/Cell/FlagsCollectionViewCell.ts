import { IThemeService } from "../../../../Services/ThemeService"
import { FlagModel } from "../../FlagsCollectionSessionModel"
import './FlagsCollectionViewCell.css'
import '../DipAnimation.css'

export interface IFlagsCollectionViewCell {
    readonly root: HTMLDivElement
}

export function FlagsCollectionViewCell(
    flag: FlagModel,
    themeService: IThemeService,
    onSetEnabled: (id: string, enabled: boolean) => void
): IFlagsCollectionViewCell {
    let isEnabled = flag.isEnabled
    const cellDiv = document.createElement('div')
    cellDiv.className = 'flagsCollectionCell noselect'

    let styling = themeService.getCurrentStyling()
    
    function updateStyle() {
        const newColor = isEnabled 
            ? styling[2]
            : styling[0]
        cellDiv.style.backgroundColor = newColor
        labelNode.style.color = styling[1]
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
    labelNode.style.color = 'grey'
    cellDiv.appendChild(labelNode)
    updateStyle()

    themeService.addChangeListener((newStyling) => {
        styling = newStyling
        updateStyle()
    })
    
    return {
        root: cellDiv
    }
}