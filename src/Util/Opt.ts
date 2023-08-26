export type Opt<Wrapped> = Wrapped | undefined

export function flatMap<Wrapped, T>(opt: Opt<Wrapped>, fn: (w: Wrapped) => T): Opt<T> {
    if (opt) {
        return fn(opt)
    }
    return undefined
}