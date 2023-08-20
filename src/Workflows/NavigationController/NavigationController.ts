export interface IController {
    root: HTMLDivElement
}

export interface INavigationController {
    setRootController(c: IController): void
    root: HTMLDivElement
}

export function NavigationController(): INavigationController {
    const div = document.createElement('div')

    function setRootController(c: IController) {
        div.replaceChildren(c.root)
    }

    return {
        setRootController,
        root: div
    }
}
