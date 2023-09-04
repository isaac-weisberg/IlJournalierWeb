import { Record, Static, String } from "runtypes"
import { INetworkingService, Method } from "./NetworkingService"
import { e, wA } from "../Util/ErrorExtensions"
import { parseJson } from "../Util/ParseJson"
import { RuntypeBase } from "runtypes/lib/runtype"

const CreateUserResponseBodyType = Record({
    accessToken: String,
    magicKey: String
})

type CreateUserResponseBody = Static<typeof CreateUserResponseBodyType>

const LoginResponseBodyType = Record({
    accessToken: String
})

type LoginResponseBody = Static<typeof LoginResponseBodyType>

const networkingFailedError = 'networking failed'
const parsingResponseBodyFailed = "parsing response body failed"

export interface IBackendService {
    createUser(): Promise<CreateUserResponseBody>
    login(magicKey: string): Promise<LoginResponseBody>
}

export interface BackendResponse<Body> {
    response: Response
    body: Promise<Body>
}

export function BackendService(networkingService: INetworkingService): IBackendService {
    const baseUrl = new URL("http://localhost:24610/iljournalierserver")

    async function createUser(): Promise<CreateUserResponseBody> {
        const resp = await genericallyRequest("/user/create", undefined, CreateUserResponseBodyType)

        if (resp.response.status != 200) {
            throw e('unexpected response from server')
        }

        return await resp.body
    }

    async function login(magicKey: string) {
        const resp = await genericallyRequest('/user/login', {
            magicKey
        }, LoginResponseBodyType)

        const status = resp.response.status

        if (status == 401) {
            throw e('server refused the login')
        }

        if (status != 200) {
            throw e('server returned an error')
        }

        return await resp.body
    }

    async function genericallyRequest<RecordType extends RuntypeBase>(path: string, body: any|undefined, responseType: RecordType): Promise<BackendResponse<Static<RecordType>>> {
        const url = new URL(path, baseUrl)

        const response = await wA(networkingFailedError, async () => {
            return await networkingService.request(url, Method.POST, body)
        })
        
        const responseBodyPromise = wA(parsingResponseBodyFailed, async () => {
            return await parseJson(response, responseType)
        })

        return {
            response,
            body: responseBodyPromise
        }
    }

    return {
        createUser,
        login
    }
}