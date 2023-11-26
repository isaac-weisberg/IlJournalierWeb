
export function e(msg: string, cause: unknown = undefined): Error {
    const newError = new Error(msg, {
        cause: cause
    })
    if (cause instanceof Error) {
        newError.stack = cause.stack
    }
    return newError
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

export function convertMaybeIntoCauseChain(m: any): any[] {
    let causes: any[] = []
    let parent: unknown = m
    if (m instanceof Error) {
        while (parent) {
            if (parent instanceof Error) {
                causes.push(parent.message)
                parent = parent.cause
            } else {
                causes.push(parent)
                parent = undefined
            }
        }
    } else {
        causes.push(m)
    }

    return causes
}

export function convertMaybeIntoString(m: any): string {
    return convertMaybeIntoCauseChain(m).join('\n')
}

export function debugLogE(message?: any, ...optionalParams: any[]) {
    if (process.env.NODE_ENV === 'development') {
        console.error(convertMaybeIntoCauseChain(message), ...optionalParams)
    }
}

export function debugLogM(message?: any, ...optionalParams: any[]) {
    if (process.env.NODE_ENV === 'development') {
        console.log(message, ...optionalParams)
    }
}