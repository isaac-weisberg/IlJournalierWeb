import { StylishButton } from "../../Views/StylishButton"
import { FlagsCollectionPresenter } from "./FlagsCollectionPresenter"
import { FlagsCollectionView } from "./CollectionView/FlagsCollectionView"
import './FlagsCollectionHub.css'
import { StylishTextInput } from "../../Views/StylishTextInput"
import { FlagsCollectionSessionModel } from "./FlagsCollectionSessionModel"
import { FlagsDatabaseStorageServiceV1 } from "../../Services/FlagsDatabaseStorageServiceV1"
import { FlagsCollectionTitleBanner } from "./TitleBanner/FlagsCollectionTitleBanner"
import { MemoryUsageLabel } from "./MemoryUsageLabel"
import { ThemeService } from "../../Services/ThemeService"
import { DevPanel } from "../DevPanel/DevPanel"
import { StoragePersistanceService } from "../../Services/StoragePersistanceService"
import { MoreMessagesStorageService } from "../../Services/MoreMessagesStorageService"

export interface IFlagsCollectionHub {
    readonly root: HTMLDivElement
}

export function FlagsCollectionHub() {
    const themeService = ThemeService()

    const root = document.createElement('div')
    root.className = 'flagsCollectionHub'

    const topBanner = FlagsCollectionTitleBanner(undefined, themeService)
    root.appendChild(topBanner.root)
    
    const storagePersistenceService = StoragePersistanceService()
    const flagsDatabaseStorage = FlagsDatabaseStorageServiceV1()
    const moreMessagesDbStorage = MoreMessagesStorageService()
    const flagsCollectionSessionModel = FlagsCollectionSessionModel(flagsDatabaseStorage, moreMessagesDbStorage)
    const flagCollectionPresenter = FlagsCollectionPresenter(flagsCollectionSessionModel)

    const flagCollectionView = FlagsCollectionView(flagCollectionPresenter, themeService)
    root.appendChild(flagCollectionView.root)

    flagCollectionView.listenToAddTileRequests(() => {
        const promptResult = window.prompt('Enter the name for the tile!')
        if (promptResult && promptResult.length > 0) {
            flagCollectionView.addFlagWithId(promptResult)
        }
    })

    const moreDiv = document.createElement('div')
    moreDiv.style.marginLeft = '16px'
    moreDiv.style.marginTop = '32px'
    moreDiv.style.fontSize = '150%'
    moreDiv.textContent = 'More?'
    root.appendChild(moreDiv)

    const moreMessageTextField = StylishTextInput( { overridePlaceholder: 'What else?' }, themeService)
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

    const memoryUsageComponent = MemoryUsageLabel(flagsDatabaseStorage)
    memoryUsageComponent.root.style.marginLeft = '16px'
    memoryUsageComponent.root.style.marginRight = '16px'
    root.appendChild(memoryUsageComponent.root)

    const devPanel = DevPanel(themeService, flagsDatabaseStorage, storagePersistenceService)
    devPanel.root.style.marginTop = '700px'
    root.appendChild(devPanel.root)

    return {
        root: root
    }
}
