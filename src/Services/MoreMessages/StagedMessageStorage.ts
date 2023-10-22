import { Array, Record, String, Number, Static } from "runtypes"
import { ITypedLocalStorageService, TypedLocalStorageHandle } from "../TypedLocalStorageService"

export interface IStagedMessageStorage {
    storeANeverSentMessage(message: NeverSentMessage): void
}

export interface NeverSentMessage {
    userId: string
    unixSeconds: number
    msg: string
}

const neverSentMessagesDbName = 'neverSentMessagesDbName'

const NeverSentMessageRecordType = Record({
    userId: String,
    unixSeconds: Number,
    msg: String
})

type NeverSentMessageRecord = Static<typeof NeverSentMessageRecordType>

const NeverSentMessagesDatabaseType = Record({
    entries: Array(NeverSentMessageRecordType)
})

type NeverSentMessagesDatabase = Static<typeof NeverSentMessagesDatabaseType>

const neverSentMessagesDatabaseHandle = TypedLocalStorageHandle(neverSentMessagesDbName, NeverSentMessagesDatabaseType)

export function StagedMessageStorage(typedLocalStorage: ITypedLocalStorageService): IStagedMessageStorage {
    function storeANeverSentMessage(message: NeverSentMessage) {
        typedLocalStorage.read(neverSentMessagesDatabaseHandle)
    }

    return {
        storeANeverSentMessage
    }
}