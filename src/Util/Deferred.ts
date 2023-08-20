export interface IDeferred<T> {
    readonly promise: Promise<T>
    resolve(s: T): void
}

export function Deferred<T>(): IDeferred<T> {
    let storedResolve: (e: T) => void
    let storedReject: (err: any) => void
    const promise = new Promise<T>((res, rej) => {
        storedResolve = res
        storedReject = rej
    })

    return {
        resolve(s: T) {
            storedResolve(s)
        },
        promise: promise
    }
}