import { IDIContext } from "../../Services/DI"
import { Opt } from "../../Util/Opt"
import { StylishButton } from "../../Views/StylishButton"
import { StylishTextInput } from "../../Views/StylishTextInput"
import { IMagicKeyViewerPresenter } from "./MagicKeyViewerPresenter"

export interface IMagicKeyViewerController {
    root: HTMLDivElement
}

export function MagicKeyViewerController(
    presenter: IMagicKeyViewerPresenter,
    di: IDIContext
): IMagicKeyViewerController {
    const div = document.createElement('div')

    const loginInfoField = StylishTextInput({
        overridePlaceholder: '',
        readOnly: true,
        themeService: di.themeService
    })

    loginInfoField.setValue(presenter.getLoginInfoForDisplay())

    div.appendChild(loginInfoField.root)

    const saveToClipboardButton = StylishButton({
        title: "Copy to clipboard",
        handler: () => {
            presenter.saveToClipboard()
        },
        themeService: di.themeService
    })
    div.appendChild(saveToClipboardButton.root)

    const proceedButton = StylishButton({
        title: 'Proceed...',
        handler: () => {
            presenter.proceed()
        },
        themeService: di.themeService
    })
    div.appendChild(proceedButton.root)

    presenter.view = {
        onClipboardTextChanged: (text) => {
            saveToClipboardButton.setTitle(text)
        }
    }

    return {
        root: div
    }
}