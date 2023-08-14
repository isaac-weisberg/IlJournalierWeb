import { IThemeService } from "../../../Services/ThemeService";
import { IFlagsCollectionPresenter } from "./../FlagsCollectionPresenter";
import { FlagModel } from "./../FlagsCollectionSessionModel";
import './FlagsCollectionView.css'
import { FlagsCollectionViewCell, IFlagsCollectionViewCell } from "./Cell/FlagsCollectionViewCell";
import { FlagsCollectionAddTileCell } from './AddTileCell/FlagsCollectionAddTileCell'
import { Bus, IBus } from "../../../Util/Bus";

export interface IFlagsCollectionView {
    readonly root: HTMLDivElement
    addFlagWithId(id: string): FlagModel | undefined
    addTileEventBus: IBus<void>
}

export function FlagsCollectionView(
    presenter: IFlagsCollectionPresenter,
    themeService: IThemeService
): IFlagsCollectionView {
    const root = document.createElement('div')
    root.className = 'flagsCollectionView'

    let flagModels = presenter.flags()

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

    const addTileEventBus = Bus<void>()

    const addTileCell = FlagsCollectionAddTileCell(() => {
        addTileEventBus.post()
    })

    let cells: IFlagsCollectionViewCell[]

    function reinstantiateCells() {
        cells = flagModels.map((flag) => {
            const cell = FlagsCollectionViewCell(flag, themeService, (flagId, isEnabled) => {
                presenter.setEnabled(flagId, isEnabled)
            })

            root.appendChild(cell.root)

            return cell
        })

        const cellDivs = cells.map(cell => cell.root)
        const allDivs = cellDivs.concat(addTileCell.root)

        root.replaceChildren(...allDivs)
    }
    
    reinstantiateCells()

    presenter.onFlagsUpdated.addHandler(() => {
        console.log("Flags updated ")
        flagModels = presenter.flags()
        reinstantiateCells()
    })
    
    return {
        root: root,
        addFlagWithId,
        addTileEventBus: addTileEventBus
    }
}