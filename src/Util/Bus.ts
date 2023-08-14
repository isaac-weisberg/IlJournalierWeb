export interface IBus<Event> {
    post(e: Event): void
    addHandler(handler: (e: Event) => void): void
}

export function Bus<Event>(): IBus<Event> {
    let handlers: ((e: Event) => void)[] = []

    function addHandler(handler: (e: Event) => void) {
        handlers.push(handler)
    }

    function post(e: Event) {
        for (const handler of handlers) {
            handler(e)
        }
    }

    return {
        addHandler,
        post
    }
}