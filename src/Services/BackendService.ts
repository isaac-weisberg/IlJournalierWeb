import { Record, Static, String } from "runtypes"
import { INetworkingService, Method } from "./NetworkingService"
import { e, wA } from "../Util/ErrorExtensions"
import { parseJson } from "../Util/ParseJson"
import { RuntypeBase } from "runtypes/lib/runtype"

const CreateUserResponseBodyType = Record({
    accessToken: String,
    loginKey: String,
    publicId: String,
    iv: String
})

type CreateUserResponseBody = Static<typeof CreateUserResponseBodyType>

const LoginResponseBodyType = Record({
    accessToken: String,
    publicId: String,
    iv: String
})

type LoginResponseBody = Static<typeof LoginResponseBodyType>

const networkingFailedError = 'networking failed'
const parsingResponseBodyFailed = "parsing response body failed"
const serverReturnedError = "server returned error"
const serverReturnedUnauthorized = 'server returned unathorized'
const serverReturnedUnexpectedStatus = 'server returned unexpected status'

export interface IBackendService {
    createUser(): Promise<CreateUserResponseBody>
    login(magicKey: string): Promise<LoginResponseBody>
    genericallyRequestWResponseBody<RecordType extends RuntypeBase>(path: string, body: any|undefined, responseType: RecordType): Promise<BackendResponse<Static<RecordType>>>
    genericallyRequestVoid(path: string, body: any|undefined): Promise<Response>
}

export interface BackendResponse<Body> {
    response: Response
    body: Body
}

export function preJournaliered(s: string): string {
    return `/iljournalierserver/${s}`
}

const userCreateRoute = preJournaliered("user/create")
const userLoginRoute = preJournaliered("user/login")

export function BackendService(networkingService: INetworkingService): IBackendService {
    const baseUrl = new URL("http://localhost:24610")

    async function createUser(): Promise<CreateUserResponseBody> {
        const resp = await genericallyRequestWResponseBody(userCreateRoute, undefined, CreateUserResponseBodyType)

        if (resp.response.status != 200) {
            throw e('unexpected response from server')
        }

        return await resp.body
    }

    async function login(magicKey: string) {
        const resp = await genericallyRequestWResponseBody(userLoginRoute, {
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

    async function genericallyRequestWResponseBody<RecordType extends RuntypeBase>(path: string, body: any|undefined, responseType: RecordType): Promise<BackendResponse<Static<RecordType>>> {
        const url = new URL(path, baseUrl)

        const response = await wA(networkingFailedError, async () => {
            return await networkingService.request(url, Method.POST, body)
        })

        if (response.status >= 500) {
            throw serverReturnedError
        }

        if (response.status == 401) {
            throw serverReturnedUnauthorized
        }

        if (response.status != 200) {
            throw serverReturnedUnexpectedStatus
        }

        const responseBody = await wA(parsingResponseBodyFailed, async () => {
            return await parseJson(response, responseType)
        })

        return {
            response,
            body: responseBody
        }
    }

    async function genericallyRequestVoid(path: string, body: any|undefined): Promise<Response> {
        const url = new URL(path, baseUrl)

        const response = await wA(networkingFailedError, async () => {
            return await networkingService.request(url, Method.POST, body)
        })

        if (response.status >= 500) {
            throw serverReturnedError
        }

        if (response.status == 401) {
            throw serverReturnedUnauthorized
        }

        if (response.status != 200) {
            throw serverReturnedUnexpectedStatus
        }
        return response
    }

    return {
        createUser,
        login,
        genericallyRequestWResponseBody,
        genericallyRequestVoid
    }
}