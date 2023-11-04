import { ICommonDIContext } from "../../../../Services/DI"
import { StylishButton } from "../../../../Views/StylishButton"
import { StylishTextInput } from "../../../../Views/StylishTextInput"

export interface IViewLoginKey {
    root: HTMLDivElement
}

interface ViewLoginKeyHandlers {
    saveToClipboard(): Promise<void>
    proceed(): void
}

export function ViewLoginKey(loginKeyToDisplay: string, di: ICommonDIContext, handlers: ViewLoginKeyHandlers): IViewLoginKey {
    const div = document.createElement('div')
    div.style.textAlign = 'center'

    const titleLabel = document.createElement('div')
    titleLabel.textContent = 'This is your login information. Save it somewhere! Like, in Telegram "Saved Messages"'
    div.appendChild(titleLabel)

    const loginInfoField = StylishTextInput({
        placeholder: '',
        readOnly: true,
        themeService: di.themeService
    })

    loginInfoField.root.style.margin = '0px auto'
    loginInfoField.root.style.width = 'calc(100% - 32px)'

    loginInfoField.setValue(loginKeyToDisplay)

    div.appendChild(loginInfoField.root)

    const buttonsContainer = document.createElement('div')
    buttonsContainer.style.display = 'flex'
    buttonsContainer.style.margin = '0px auto'
    buttonsContainer.style.justifyContent = 'flex-end'
    buttonsContainer.style.padding = '16px'
    div.appendChild(buttonsContainer)

    let clipboardPromise: any
    const saveToClipboardButton = StylishButton({
        title: "Copy to clipboard",
        handler: () => {
            if (clipboardPromise) {
                return
            }

            saveToClipboardButton.setTitle('Copying...')
            clipboardPromise = handlers.saveToClipboard()
                .then(() => {
                    saveToClipboardButton.setTitle('Saved to clipboard!')
                })
                .catch((e) => {
                    saveToClipboardButton.setTitle('Failed to copy to clipboard')
                })
                .finally(() => {
                    clipboardPromise = undefined
                })
        },
        themeService: di.themeService
    })
    buttonsContainer.appendChild(saveToClipboardButton.root)

    const proceedButton = StylishButton({
        title: 'Proceed...',
        handler: () => {
            handlers.proceed()
        },
        themeService: di.themeService
    })
    buttonsContainer.appendChild(proceedButton.root)


    return {
        root: div
    }
}