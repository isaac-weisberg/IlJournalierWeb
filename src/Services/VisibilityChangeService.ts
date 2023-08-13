export interface IVisibilityChangeService {
    addHandler(handler: (state: DocumentVisibilityState) => void): void
}

export function VisibilityChangeService(): IVisibilityChangeService {
    let handlers: ((visibilityState: DocumentVisibilityState) => void)[] = []

    document.addEventListener('visibilitychange', function() {
        let state = document.visibilityState
        for (const handler of handlers) {
            handler(state)
        }
    })

    function addHandler(handler: (state: DocumentVisibilityState) => void): void {
        handlers.push(handler)
    }

    return {
        addHandler
    }
}