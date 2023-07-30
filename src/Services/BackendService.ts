import { Record, Static, String } from "runtypes"
import { INetworkingService, Method } from "./NetworkingService"
import { wA } from "../Util/ErrorExtensions"
import { parseJson } from "../Util/ParseJson"

export interface IBackendService {
    createUser(): Promise<CreateUserResponseBody>
}

const CreateUserResponseBodyType = Record({
    accessToken: String,
    loginKey: String
})

type CreateUserResponseBody = Static<typeof CreateUserResponseBodyType>

export function BackendService(networkingService: INetworkingService): IBackendService {
    const baseUrl = new URL("http://localhost:24610/iljournalierserver")

    async function createUser(): Promise<CreateUserResponseBody> {
        const url = new URL("/user/create", baseUrl)

        const response = await wA("networking failed", async () => {
            return await networkingService.request(url, Method.POST, undefined)
        })
        
        const responseBody = await wA("parsing response body failed", async () => {
            return await parseJson(response, CreateUserResponseBodyType)
        })

        return responseBody
    }

    return {
        createUser
    }
}