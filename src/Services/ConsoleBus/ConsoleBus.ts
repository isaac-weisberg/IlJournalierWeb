export interface IConsoleBus {
    post(msg: string): void
    handler?: (msg: string) => void
}

export function ConsoleBus(): IConsoleBus {
    return {
        post(msg) {
            if (this.handler) {
                this.handler(msg)
            }
        },
        handler: undefined
    }
}