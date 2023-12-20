export interface IController {
    root: HTMLDivElement
    updateLayout(): void
}

export interface INavigationController {
    setRootController(c: IController): void
    root: HTMLDivElement
}

interface Frame {
    c: IController
    container: HTMLDivElement
}


function NewFrame(controller: IController): Frame {
    const wrapperDiv = document.createElement('div')
    wrapperDiv.appendChild(controller.root)

    return {
        c: controller,
        container: wrapperDiv
    }
}

export function NavigationController(): INavigationController {
    const div = document.createElement('div')

    var frames: Frame[] = []

    function setRootController(c: IController) {
        const newFrame = NewFrame(c)
        frames = [newFrame]
        div.replaceChildren(newFrame.container)
        c.updateLayout()
    }

    return {
        setRootController,
        root: div
    }
}
