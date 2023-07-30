
export function e(msg: string, cause: unknown = undefined): Error {
    return new Error(msg, {
        cause: cause
    })
}

export async function wA<R>(msg: string, work: () => Promise<R>): Promise<R> {
    try {
        return await work()
    } catch(err) {
        throw e(msg, err)
    }
}

export function wS<R>(msg: string, work: () => R): R {
    try {
        return work()
    } catch(err) {
        throw e(msg, err)
    }
}
