import { IThemeService } from "../../../Services/ThemeService";
import { IFlagsCollectionPresenter } from "./../FlagsCollectionPresenter";
import { FlagModel } from "./../FlagsCollectionSessionModel";
import './FlagsCollectionView.css'
import { FlagsCollectionViewCell } from "./Cell/FlagsCollectionViewCell";
import { FlagsCollectionAddTileCell } from './AddTileCell/FlagsCollectionAddTileCell'

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

    const addTileCell = FlagsCollectionAddTileCell()

    let cells = flagModels.map((flag) => {
        const cell = FlagsCollectionViewCell(flag, themeService, (flagId, isEnabled) => {
            presenter.setEnabled(flagId, isEnabled)
        })

        root.appendChild(cell.root)

        return cell
    })

    root.appendChild(addTileCell.root)

    function handleFlagAdded(flag: FlagModel) {
        const cell = FlagsCollectionViewCell(flag, themeService, (flagId, isEnabled) => {
            presenter.setEnabled(flagId, isEnabled)
        })
        
        cells.push(cell)
        root.insertBefore(cell.root, addTileCell.root)
    }
    
    return {
        root: root,
        handleFlagAdded
    }
}