import { IDIContext } from "../../../../Services/DI"
import { StylishButton } from "../../../../Views/StylishButton"
import { StylishTextInput } from "../../../../Views/StylishTextInput"

export interface IViewLoginKey {
    root: HTMLDivElement
}

interface ViewLoginKeyHandlers {
    saveToClipboard(): Promise<void>
    proceed(): void
}

export function ViewLoginKey(loginKeyToDisplay: string, di: IDIContext, handlers: ViewLoginKeyHandlers): IViewLoginKey {
    const div = document.createElement('div')

    const loginInfoField = StylishTextInput({
        placeholder: '',
        readOnly: true,
        themeService: di.themeService
    })

    loginInfoField.setValue(loginKeyToDisplay)

    div.appendChild(loginInfoField.root)

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
    div.appendChild(saveToClipboardButton.root)

    const proceedButton = StylishButton({
        title: 'Proceed...',
        handler: () => {
            handlers.proceed()
        },
        themeService: di.themeService
    })
    div.appendChild(proceedButton.root)


    return {
        root: div
    }
}