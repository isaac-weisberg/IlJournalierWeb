import { IDIContext } from "../../Services/DI"
import { StylishButton } from "../../Views/StylishButton"
import './CreateUserController.css'

export interface ICreateUserController {
    root: HTMLDivElement
}

export function CreateUserController(di: IDIContext): ICreateUserController {
    const div = document.createElement('div')
    div.className = 'createUserController'

    const scrollContent = document.createElement('div')
    div.appendChild(scrollContent)

    const createUserButton = StylishButton({
        title: 'Create User',
        handler: () => {
            
        },
        themeService: di.themeService
    })

    scrollContent.appendChild(createUserButton.root)

    return {
        root: div
    }
}