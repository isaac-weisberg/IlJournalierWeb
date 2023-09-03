import { IDIContext } from "../../Services/DI"
import { StylishButton } from "../../Views/StylishButton"
import { StylishTextInput } from "../../Views/StylishTextInput"
import './CreateUserController.css'
import { ICreateUserPresenter } from "./CreateUserPresenter"
import { CreateUserTitleBannerView } from "./Views/CreateUserTitleBannerView"

export interface ICreateUserController {
    root: HTMLDivElement
}

export function CreateUserController(presenter: ICreateUserPresenter, di: IDIContext): ICreateUserController {
    const div = document.createElement('div')
    div.className = 'createUserController appear'

    const scrollContent = document.createElement('div')
    scrollContent.style.paddingBottom = '100px'
    div.appendChild(scrollContent)

    const banner = CreateUserTitleBannerView(di.themeService)
    scrollContent.appendChild(banner.root)

    const firstLabel = document.createElement('div')
    firstLabel.style.whiteSpace = 'pre'
    firstLabel.textContent = 'Welcome to your new **real** journal!\r\n\r\nLogin or create a new user'
    firstLabel.style.margin = '20px auto'
    firstLabel.style.maxWidth = '80%'
    firstLabel.style.textAlign = 'center'
    scrollContent.appendChild(firstLabel)

    const loginContainer = document.createElement('div')
    loginContainer.style.margin = '0px 20px'
    loginContainer.style.display = 'flex'
    scrollContent.appendChild(loginContainer)

    const loginInfoField = StylishTextInput({
        readOnly: false,
        placeholder: 'Login Info',
        fontSize: '18px',
        themeService: di.themeService
    })
    loginInfoField.root.style.marginRight = '8px'
    loginInfoField.root.style.width = 'calc(100% - 40px)'
    loginContainer.appendChild(loginInfoField.root)

    const loginButton = StylishButton({
        title: 'Login',
        handler: () => {

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
    scrollContent.appendChild(secondLabel)

    const createUserButton = StylishButton({
        title: 'Create User',
        handler: () => {
            presenter.createNewUser()
        },
        themeService: di.themeService
    })
    createUserButton.root.style.margin = '16px auto 0px auto'

    scrollContent.appendChild(createUserButton.root)

    return {
        root: div
    }
}