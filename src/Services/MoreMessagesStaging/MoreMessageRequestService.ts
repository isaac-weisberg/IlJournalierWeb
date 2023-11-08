import { IBackendService, preJournaliered } from "../BackendService";
import { IAccessTokenHavingRequest } from "../../Models/IAccessTokenHavingRequest";
import { wA } from "../../Util/ErrorExtensions";

export interface IMoreMessageRequestService {
    sendMessages(accessToken: string, models: AddMoreMessageRequestMessageModel[]): Promise<void>
}

export interface AddMoreMessageRequestMessageModel {
    unixSeconds: number
    msg: string
}

interface AddMoreMessageRequest extends IAccessTokenHavingRequest {
    requests: AddMoreMessageRequestMessageModel[]
}

export function MoreMessageRequestService(backendService: IBackendService): IMoreMessageRequestService {
    async function sendMessages(accessToken: string, models: AddMoreMessageRequestMessageModel[]) {
        const body: AddMoreMessageRequest = {
            accessToken: accessToken,
            requests: models
        }
        
        await wA('calling messages/add failed', async () => {
            return await backendService.genericallyRequestVoid(preJournaliered('messages/add'), body)
        })
    }

    return {
        sendMessages
    }
}