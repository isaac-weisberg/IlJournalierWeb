import { Unknown } from "runtypes";
import { IBackendService } from "../BackendService";
import { IAccessTokenHavingRequest } from "../../Models/IAccessTokenHavingRequest";
import { wA } from "../../Util/ErrorExtensions";

export interface IMoreMessagesRequestService {
    sendMessages(accessToken: string, models: AddMoreMessageRequestMessageModel[]): Promise<void>
}

export interface AddMoreMessageRequestMessageModel {
    unixSeconds: number
    msg: string
}

interface AddMoreMessageRequest extends IAccessTokenHavingRequest {
    requests: AddMoreMessageRequestMessageModel[]
}

export function MoreMessagesRequestService(backendService: IBackendService): IMoreMessagesRequestService {
    async function sendMessages(accessToken: string, models: AddMoreMessageRequestMessageModel[]) {
        const body: AddMoreMessageRequest = {
            accessToken: accessToken,
            requests: models
        }

        const jsonString = JSON.stringify(body)
        
        wA('calling messages/add failed', async () => {
            return await backendService.genericallyRequest('messages/add', jsonString, Unknown)
        })
    }

    return {
        sendMessages
    }
}