import { IDIContext } from "../../Services/DI"
import { StylishButton } from "../../Views/StylishButton"
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
    div.appendChild(scrollContent)

    const banner = CreateUserTitleBannerView(di.themeService)
    scrollContent.appendChild(banner.root)
    scrollContent.style.paddingBottom = '100px'

    const createUserButton = StylishButton({
        title: 'Create User',
        handler: () => {
            presenter.createNewUser()
        },
        themeService: di.themeService
    })
    createUserButton.root.style.margin = '60px auto 0px auto'

    scrollContent.appendChild(createUserButton.root)

    return {
        root: div
    }
}