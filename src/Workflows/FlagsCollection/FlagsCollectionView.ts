import { IThemeService } from "../../Services/ThemeService";
import { IFlagsCollectionPresenter } from "./FlagsCollectionPresenter";
import { FlagModel } from "./FlagsCollectionSessionModel";
import './FlagsCollectionView.css'
import { FlagsCollectionViewCell } from "./FlagsCollectionViewCell";

export interface IFlagsCollectionView {
    readonly root: HTMLDivElement
    handleFlagAdded(flag: FlagModel): void
}

export function FlagsCollectionView(
    presenter: IFlagsCollectionPresenter,
    themeService: IThemeService
): IFlagsCollectionView {
    const root = document.createElement('div')
    root.className = 'flagsCollectionView'

    const flagModels = presenter.flags

    let cells = flagModels.map((flag) => {
        const cell = FlagsCollectionViewCell(flag, themeService, (flagId, isEnabled) => {
            presenter.setEnabled(flagId, isEnabled)
        })

        root.appendChild(cell.root)

        return cell
    })

    function handleFlagAdded(flag: FlagModel) {
        const cell = FlagsCollectionViewCell(flag, themeService, (flagId, isEnabled) => {
            presenter.setEnabled(flagId, isEnabled)
        })
        
        cells.push(cell)
        root.appendChild(cell.root)
    }
    
    return {
        root: root,
        handleFlagAdded
    }
}