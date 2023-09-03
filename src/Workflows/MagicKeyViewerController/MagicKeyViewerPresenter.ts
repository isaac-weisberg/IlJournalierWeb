import { Opt } from "../../Util/Opt"

export interface IMagicKeyViewerPresenter {
    getLoginInfoForDisplay(): string
    saveToClipboard(): void
    proceed(): void
    navigation?: {
        onUserWantsToGoOn: () => void
    },
    view?: {
        onClipboardTextChanged: (text: string) => void
    }
}

export function MagicKeyViewerPresenter(
    data: {
        magicKey: string,
        saultGoodman: string
    }
): IMagicKeyViewerPresenter {
    const loginInfo = `${data.magicKey}@${data.saultGoodman}`

    return {
        getLoginInfoForDisplay() {
            return loginInfo
        },
        proceed() {
            this.navigation?.onUserWantsToGoOn()
        },
        saveToClipboard() {
            this.view?.onClipboardTextChanged('Copying...')
            navigator.clipboard.writeText(loginInfo)
                .then(() => {
                    this.view?.onClipboardTextChanged('Saved to clipboard!')
                })
                .catch((e) => {
                    this.view?.onClipboardTextChanged('Failed to copy to clipboard')
                })
        }
    }
}