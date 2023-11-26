import { wA } from "../Util/ErrorExtensions"

export enum Method {
    GET = "GET",
    POST = "POST",
}

export interface INetworkingService {
    request(url: URL, method: Method, body: any): Promise<Response>
}

export function NetworkingService(): INetworkingService {
    async function request(url: URL, method: Method, body: any): Promise<Response> {
        let bodyString: string|undefined
        if (body) {
            bodyString = JSON.stringify(body)
        }

        return await wA('fetch failed', async () => await fetch(url, {
            method: method,
            body: bodyString
        }))
    }

    return {
        request
    }
}