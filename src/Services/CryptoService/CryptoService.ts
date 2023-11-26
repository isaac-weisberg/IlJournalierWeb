import { wA } from "../../Util/ErrorExtensions"

interface EncryptCtx {
    iv: Uint8Array
    password: CryptoKey
}

export interface ICryptoService {
    encrypt(value: string): Promise<string>
}

export function CryptoService(
    iv: string,
    password: string
): ICryptoService {
    const algorithm = 'AES-GCM'
    const enc = new TextEncoder()
    const dec = new TextDecoder()

    async function generateKey() {
        const key = await wA('generate key failed', async () => {
            return await crypto.subtle.generateKey({
                name: 'AES-GCM',
                length: 256
            }, true, [ 'decrypt', 'encrypt' ])
        })

        return key
    }

    const getCtx = (async function() {
        const pass = enc.encode(password)
        const passBuffer = pass.buffer

        const passCryptoKey = await wA('import key failed', async () => {
            return await crypto.subtle.importKey('raw', passBuffer, algorithm, false, ['decrypt', 'encrypt'])
        }) 

        const encodedIv = enc.encode(iv)

        const ctx: EncryptCtx = {
            iv: encodedIv,
            password: passCryptoKey
        }
        return ctx
    })()

    return {
        async encrypt(value) {
            const ctx = await wA('building encrypt ctx failed', async () => {
                return await getCtx
            })

            const encodedValue = enc.encode(value).buffer
            const result = await wA('encrypt failed', async () => { 
                return await self.crypto.subtle.encrypt(
                    { 
                        name: algorithm, 
                        iv: ctx.iv
                    },
                    ctx.password,
                    encodedValue
                )
            })

            const string = dec.decode(result)

            return string
        }
    }
}