import { IDIContext } from "../../../Services/DI"
import './CreateUserController.css'
import { ICreateUserPresenter } from "./CreateUserPresenter"
import { CreateUserTitleBannerView } from "../CreateUserTitleBannerView/CreateUserTitleBannerView"
import { CreateUserSheet } from "./Views/CreateUserSheet"
import { ViewLoginKey } from "./Views/ViewLoginKeySheet"
import { Spinner } from "../../../Views/Spinner/Spinner"

export interface ICreateUserController {
    root: HTMLDivElement
}

export function CreateUserController(presenter: ICreateUserPresenter, di: IDIContext): ICreateUserController {
    const div = document.createElement('div')
    div.className = 'createUserController'
    div.style.opacity = '0'
    setTimeout(() => {
        div.classList.add('appear')
    }, 250)

    const scrollContent = document.createElement('div')
    scrollContent.style.paddingBottom = '100px'
    div.appendChild(scrollContent)

    const banner = CreateUserTitleBannerView(di.themeService)
    scrollContent.appendChild(banner.root)

    function setSpinnerShown(l: boolean) {
        if (l) {
            spinner.root.style.display = 'block'
            spinner.root.style.opacity = '1'
        } else {
            spinner.root.style.display = 'none'
            spinner.root.style.opacity = '0'
        }
    }

    const createUserSheet = CreateUserSheet(di, {
        createNewUser() {
            presenter.createNewUser()
        },
        login(loginKeys) {
            presenter.login(loginKeys)
        },
    })

    scrollContent.appendChild(createUserSheet.root)

    const spinner = Spinner()

    spinner.root.style.top = '50%'
    spinner.root.style.left = '50%'
    spinner.root.style.transform = 'translate(-50%, -50%)'
    div.appendChild(spinner.root)

    setSpinnerShown(false)

    presenter.view = {
        setLoading: setSpinnerShown,
        onUserCreated(u) {
            const viewLoginKeySheet = ViewLoginKey(u.loginInfo, di, {
                async saveToClipboard() {
                    await presenter.saveToClipboard(u.loginInfo)
                },
                proceed() {
                    presenter.userHasSavedLoginInfoAndWantsToProceed(u)
                }
            })

            scrollContent.replaceChild(viewLoginKeySheet.root, createUserSheet.root)
        },
        onCreateUserFailed(e) {

        },
        onLoginFailed(e) {
            
        },
    }

    return {
        root: div
    }
}