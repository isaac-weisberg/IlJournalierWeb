import { StylishButton } from "../../Views/StylishButton"
import { FlagsCollectionPresenter } from "./FlagsCollectionPresenter"
import { FlagsCollectionView } from "./FlagsCollectionView"
import './FlagsCollectionHub.css'
import { StylishTextInput } from "../../Views/StylishTextInput"
import { FlagsCollectionSessionModel } from "./FlagsCollectionSessionModel"
import { FlagsDatabaseStorageServiceV1 } from "./FlagsDatabaseStorageServiceV1"

export interface IFlagsCollectionHub {
    readonly root: HTMLDivElement
}

export function FlagsCollectionHub() {
    const root = document.createElement('div')
    root.className = 'flagsCollectionHub'
    
    const flagsDatabaseLoader = FlagsDatabaseStorageServiceV1()
    const flagsCollectionSessionModel = FlagsCollectionSessionModel(flagsDatabaseLoader)
    const flagCollectionPresenter = FlagsCollectionPresenter(flagsCollectionSessionModel)    
    const flagCollectionView = FlagsCollectionView(flagCollectionPresenter)
    root.appendChild(flagCollectionView.root)

    const stylishTextInput = StylishTextInput()
    root.appendChild(stylishTextInput.root)
    const stylishButton = StylishButton('Add a new tile', () => {
        const value = stylishTextInput.value()
        if (value && value.length > 0) {
            const id = value
            const addedFlag = flagsCollectionSessionModel.addFlag(id)
            if (addedFlag) {
                flagCollectionPresenter.handleFlagAdded(addedFlag)
                flagCollectionView.handleFlagAdded(addedFlag)
            }
        }
    })
    root.appendChild(stylishButton.root)

    return {
        root: root
    }
}
