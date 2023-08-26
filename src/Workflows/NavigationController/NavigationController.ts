export interface IController {
    root: HTMLDivElement
}

export interface INavigationController {
    setRootController(c: IController): void
    pushController(c: IController): void
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
    }

    function pushController(c: IController) {
        const frame = NewFrame(c)
        frames = frames.concat([frame])
        div.replaceChildren(frame.container)
    }

    return {
        pushController,
        setRootController,
        root: div
    }
}
