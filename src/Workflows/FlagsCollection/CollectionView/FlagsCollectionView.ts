import { IThemeService } from "../../../Services/ThemeService";
import { IFlagsCollectionPresenter } from "./../FlagsCollectionPresenter";
import { FlagModel } from "./../FlagsCollectionSessionModel";
import './FlagsCollectionView.css'
import { FlagsCollectionViewCell } from "./Cell/FlagsCollectionViewCell";
import { FlagsCollectionAddTileCell } from './AddTileCell/FlagsCollectionAddTileCell'

export interface IFlagsCollectionView {
    readonly root: HTMLDivElement
    addFlagWithId(id: string): FlagModel | undefined
    listenToAddTileRequests(handler: () => void): void
}

export function FlagsCollectionView(
    presenter: IFlagsCollectionPresenter,
    themeService: IThemeService
): IFlagsCollectionView {
    const root = document.createElement('div')
    root.className = 'flagsCollectionView'

    const flagModels = presenter.flags()

    function addFlagWithId(id: string): FlagModel | undefined {
        const addedFlag = presenter.addFlag(id)
        if (addedFlag) {
            const cell = FlagsCollectionViewCell(addedFlag, themeService, (flagId, isEnabled) => {
                presenter.setEnabled(flagId, isEnabled)
            })
            
            cells.push(cell)
            root.insertBefore(cell.root, addTileCell.root)
        }
        return addedFlag
    }

    let addTileRequestsHandler: (() => void)|undefined

    const addTileCell = FlagsCollectionAddTileCell(() => {
        addTileRequestsHandler?.()
    })

    let cells = flagModels.map((flag) => {
        const cell = FlagsCollectionViewCell(flag, themeService, (flagId, isEnabled) => {
            presenter.setEnabled(flagId, isEnabled)
        })

        root.appendChild(cell.root)

        return cell
    })

    root.appendChild(addTileCell.root)
    
    return {
        root: root,
        addFlagWithId,
        listenToAddTileRequests(handler) {
            addTileRequestsHandler = handler
        }
    }
}