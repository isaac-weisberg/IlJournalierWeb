import { StylishButton } from "../../Views/StylishButton"
import { FlagsCollectionPresenter } from "./FlagsCollectionPresenter"
import { FlagsCollectionView } from "./FlagsCollectionView"
import './FlagsCollectionHub.css'
import { StylishTextInput } from "../../Views/StylishTextInput"
import { FlagsCollectionSessionModel } from "./FlagsCollectionSessionModel"
import { FlagsDatabaseStorageServiceV1 } from "./FlagsDatabaseStorageServiceV1"
import { FlagsCollectionTitleBanner } from "./FlagsCollectionTitleBanner"

export interface IFlagsCollectionHub {
    readonly root: HTMLDivElement
}

export function FlagsCollectionHub() {
    const root = document.createElement('div')
    root.className = 'flagsCollectionHub'

    const banner = FlagsCollectionTitleBanner()
    root.appendChild(banner.root)
    
    const flagsDatabaseLoader = FlagsDatabaseStorageServiceV1()
    const flagsCollectionSessionModel = FlagsCollectionSessionModel(flagsDatabaseLoader)
    const flagCollectionPresenter = FlagsCollectionPresenter(flagsCollectionSessionModel)    
    const flagCollectionView = FlagsCollectionView(flagCollectionPresenter)
    root.appendChild(flagCollectionView.root)

    const stylishTextInput = StylishTextInput()
    stylishTextInput.root.style.width = 'calc(100% - 32px)'
    stylishTextInput.root.style.marginLeft = '16px'
    stylishTextInput.root.style.marginRight = '16px'
    root.appendChild(stylishTextInput.root)

    const stylishButton = StylishButton('Add a new tile', () => {
        const value = stylishTextInput.value()
        if (value && value.length > 0) {
            const id = value
            const addedFlag = flagsCollectionSessionModel.addFlag(id)
            if (addedFlag) {
                stylishTextInput.reset()
                flagCollectionPresenter.handleFlagAdded(addedFlag)
                flagCollectionView.handleFlagAdded(addedFlag)
            }
        }
    })
    stylishButton.root.style.marginLeft = 'auto'
    stylishButton.root.style.marginRight = '16px'
    root.appendChild(stylishButton.root)

    return {
        root: root
    }
}
