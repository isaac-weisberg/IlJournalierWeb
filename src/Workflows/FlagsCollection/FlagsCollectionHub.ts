import { StylishButton } from "../../Views/StylishButton"
import { FlagsCollectionPresenter } from "./FlagsCollectionPresenter"
import { FlagsCollectionView } from "./FlagsCollectionView"
import './FlagsCollectionHub.css'
import { StylishTextInput } from "../../Views/StylishTextInput"
import { FlagsCollectionSessionModel } from "./FlagsCollectionSessionModel"
import { FlagsDatabaseStorageServiceV1 } from "./FlagsDatabaseStorageServiceV1"
import { FlagsCollectionTitleBanner } from "./FlagsCollectionTitleBanner"
import { MemoryUsageLabel } from "./MemoryUsageLabel"
import { ThemeService } from "../../Services/ThemeService"

export interface IFlagsCollectionHub {
    readonly root: HTMLDivElement
}

export function FlagsCollectionHub() {
    const themeService = ThemeService()

    const root = document.createElement('div')
    root.className = 'flagsCollectionHub'

    const topBanner = FlagsCollectionTitleBanner(undefined, themeService)
    root.appendChild(topBanner.root)
    
    const flagsDatabaseLoader = FlagsDatabaseStorageServiceV1()
    const flagsCollectionSessionModel = FlagsCollectionSessionModel(flagsDatabaseLoader)
    const flagCollectionPresenter = FlagsCollectionPresenter(flagsCollectionSessionModel)    
    const flagCollectionView = FlagsCollectionView(flagCollectionPresenter, themeService)
    root.appendChild(flagCollectionView.root)

    const newTileTextInput = StylishTextInput(themeService)
    newTileTextInput.root.style.width = 'calc(100% - 32px)'
    newTileTextInput.root.style.marginLeft = '16px'
    newTileTextInput.root.style.marginRight = '16px'
    root.appendChild(newTileTextInput.root)

    const addTileButton = StylishButton('Add a new tile', themeService, () => {
        const value = newTileTextInput.value()
        if (value && value.length > 0) {
            const id = value
            const addedFlag = flagsCollectionSessionModel.addFlag(id)
            if (addedFlag) {
                newTileTextInput.reset()
                flagCollectionPresenter.handleFlagAdded(addedFlag)
                flagCollectionView.handleFlagAdded(addedFlag)
            }
        }
    })
    addTileButton.root.style.marginLeft = 'auto'
    addTileButton.root.style.marginRight = '16px'
    root.appendChild(addTileButton.root)

    const moreDiv = document.createElement('div')
    moreDiv.style.marginLeft = '16px'
    moreDiv.style.marginTop = '32px'
    moreDiv.style.fontSize = '150%'
    moreDiv.textContent = 'More?'
    root.appendChild(moreDiv)

    const moreMessageTextField = StylishTextInput(themeService)
    moreMessageTextField.root.style.width = 'calc(100% - 32px)'
    moreMessageTextField.root.style.marginLeft = '16px'
    moreMessageTextField.root.style.marginRight = '16px'
    moreMessageTextField.root.style.marginTop = '16px'
    root.appendChild(moreMessageTextField.root)

    const moreMessageButton = StylishButton('Log more', themeService, () => {
        const value = moreMessageTextField.value()
        if (value && value.length > 0) {
            flagsCollectionSessionModel.addMoreMessage(value)
            moreMessageTextField.reset()
        }
    })
    moreMessageButton.root.style.marginLeft = 'auto'
    moreMessageButton.root.style.marginRight = '16px'
    root.appendChild(moreMessageButton.root)

    const memoryUsageComponent = MemoryUsageLabel(flagsDatabaseLoader)
    memoryUsageComponent.root.style.marginLeft = '16px'
    memoryUsageComponent.root.style.marginRight = '16px'
    root.appendChild(memoryUsageComponent.root)

    return {
        root: root
    }
}
