import { IThemeService } from "../../../Services/ThemeService"
import { StylishButton } from "../../../Views/StylishButton"
import { StylishTextInput } from "../../../Views/StylishTextInput"
import { ISendAwayLegacyMessagesPresenter } from "./SendAwayLegacyMessagesPresenter"

export interface ISendAwayLegacyMessagesWidget {
    div: HTMLDivElement
}

export function SendAwayLegacyMessagesWidget(
    presenter: ISendAwayLegacyMessagesPresenter
): ISendAwayLegacyMessagesWidget {
    const div = document.createElement('div')

    div.style.display = 'flex'

    const passTextField = StylishTextInput({
        placeholder: 'Legacy MSG pass',
        readOnly: false,
        themeService: presenter.themeService,
    })

    div.appendChild(passTextField.root)

    let sending = false
    const sendButton = StylishButton({
        title: 'Send Legacy MSGs',
        async handler() {
            if (sending) {
                return
            }
            const pass = passTextField.value()

            if (pass == '0451') {
                sending = true
                await presenter.sendAwayLegacyMessages()
                
                passTextField.setValue('sending')
                sending = false
            }
        },
        themeService: presenter.themeService
    })

    div.appendChild(sendButton.root)

    return {
        div
    }
}