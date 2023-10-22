import { StylishButton } from "../../Views/StylishButton"
import { FlagsCollectionView } from "./CollectionView/FlagsCollectionView"
import './FlagsCollectionViewController.css'
import { StylishTextInput } from "../../Views/StylishTextInput"
import { FlagsCollectionTitleBanner } from "./TitleBanner/FlagsCollectionTitleBanner"
import { MemoryUsageLabel } from "./MemoryUsageLabel"
import { DevPanel } from "../DevPanel/DevPanel"
import { ICommonDIContext } from "../../Services/DI"
import { IFlagsCollectionPresenter } from "./FlagsCollectionPresenter"

export interface IFlagsCollectionViewController {
    readonly root: HTMLDivElement
}

export function FlagsCollectionViewController(presenter: IFlagsCollectionPresenter, diContext: ICommonDIContext) {
    const root = document.createElement('div')
    root.className = "flagsCollectionRoot"

    const scrollContent = document.createElement('div')
    scrollContent.className = 'flagsCollectionScrollContent'
    root.appendChild(scrollContent)

    const topBanner = FlagsCollectionTitleBanner(undefined, diContext.themeService)
    scrollContent.appendChild(topBanner.root)

    const flagCollectionView = FlagsCollectionView(presenter, diContext.themeService)
    scrollContent.appendChild(flagCollectionView.root)

    flagCollectionView.addTileEventBus.addHandler(() => {
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
    scrollContent.appendChild(moreDiv)

    const moreMessageTextField = StylishTextInput({ 
        placeholder: 'What else?',
        readOnly: false,
        themeService: diContext.themeService
    })
    moreMessageTextField.root.style.width = 'calc(100% - 32px)'
    moreMessageTextField.root.style.marginLeft = '16px'
    moreMessageTextField.root.style.marginRight = '16px'
    moreMessageTextField.root.style.marginTop = '16px'
    scrollContent.appendChild(moreMessageTextField.root)

    const moreMessageButton = StylishButton({
        title: 'Log more',
        themeService: diContext.themeService,
        handler: () => {
            const value = moreMessageTextField.value()
            if (value && value.length > 0) {
                presenter.addMoreMessage(value)
                moreMessageTextField.reset()
            }
        }
    })
    moreMessageButton.root.style.marginLeft = 'auto'
    moreMessageButton.root.style.marginRight = '16px'
    scrollContent.appendChild(moreMessageButton.root)

    const memoryUsageComponent = MemoryUsageLabel(diContext)
    memoryUsageComponent.root.style.marginLeft = '16px'
    memoryUsageComponent.root.style.marginRight = '16px'
    scrollContent.appendChild(memoryUsageComponent.root)

    const devPanel = DevPanel(diContext)
    devPanel.root.style.marginTop = '700px'
    scrollContent.appendChild(devPanel.root)

    return {
        root: root
    }
}
