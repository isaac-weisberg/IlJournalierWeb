import { ICommonDIContext } from "../../../../Services/DI"
import { StylishButton } from "../../../../Views/StylishButton"
import { StylishTextInput } from "../../../../Views/StylishTextInput"

export interface ICreateUserSheet {
    root: HTMLDivElement
}

interface CreateUserSheetHandlers {
    login(loginKeys: string): void
    createNewUser(): void
}

export function CreateUserSheet(di: ICommonDIContext, handlers: CreateUserSheetHandlers): ICreateUserSheet {
    const root = document.createElement('div')

    const firstLabel = document.createElement('div')
    firstLabel.style.whiteSpace = 'pre-line'
    firstLabel.textContent = 'Welcome to your new **real** journal!\r\n\r\nLogin or create a new user'
    firstLabel.style.margin = '20px auto'
    firstLabel.style.maxWidth = '80%'
    firstLabel.style.textAlign = 'center'
    root.appendChild(firstLabel)

    const loginContainer = document.createElement('div')
    loginContainer.style.margin = '0px 20px'
    loginContainer.style.display = 'flex'
    root.appendChild(loginContainer)

    const loginInfoField = StylishTextInput({
        readOnly: false,
        placeholder: 'Login Keys',
        fontSize: '18px',
        themeService: di.themeService
    })
    loginInfoField.root.style.marginRight = '8px'
    loginInfoField.root.style.width = 'calc(100% - 40px)'
    loginContainer.appendChild(loginInfoField.root)

    const loginButton = StylishButton({
        title: 'Login',
        handler: () => {
            const value = loginInfoField.value()
            if (value.length > 0) {
                handlers.login(value)
            }
        },
        themeService: di.themeService
    })
    loginButton.root.style.flexGrow = '4'
    loginContainer.appendChild(loginButton.root)

    const secondLabel = document.createElement('div')
    secondLabel.style.whiteSpace = 'pre'
    secondLabel.textContent = '--- or ---'
    secondLabel.style.margin = '20px auto'
    secondLabel.style.maxWidth = '80%'
    secondLabel.style.textAlign = 'center'
    root.appendChild(secondLabel)

    const createUserButton = StylishButton({
        title: 'Create User',
        handler: () => {
            handlers.createNewUser()
        },
        themeService: di.themeService
    })
    createUserButton.root.style.margin = '16px auto 0px auto'

    root.appendChild(createUserButton.root)

    return {
        root
    }
}