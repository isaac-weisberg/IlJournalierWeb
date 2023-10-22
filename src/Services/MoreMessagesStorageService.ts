import { moreMessagesDbSchemaV1StorageKey } from '../Util/Const'
import { MoreMessagesDbSchemaV1Type, MoreMessagesDbSchemaV1 } from './MoreMessagesDbSchemaV1'
import { ITypedLocalStorageService, ITypedLocalStorageHandle } from './TypedLocalStorageService'

export interface IMoreMessagesStorageService {
    dumpRawDatabase(): string|undefined
    overrideRawDatabase(database: string): void
    save(db: MoreMessagesDbSchemaV1): void
    load(): MoreMessagesDbSchemaV1|undefined
    currentStorageStringLength(): number|undefined
    addOnCurrentStorageStringLengthChangedHandler(handler: (length: number) => void): void
}

const moreMessagesDbHandle: ITypedLocalStorageHandle<typeof MoreMessagesDbSchemaV1Type> = {
    key: moreMessagesDbSchemaV1StorageKey,
    recordType: MoreMessagesDbSchemaV1Type
}

export function MoreMessagesStorageService(typedLocalStorage: ITypedLocalStorageService): IMoreMessagesStorageService {
    let lastKnownStorageLength: number|undefined
    let onCurrentStorageStringLengthChanged: ((length: number) => void)|undefined

    function updateLastKnownStrorageLength(untypedExistingDbStringLength: number) {
        const storageLength = untypedExistingDbStringLength
        lastKnownStorageLength = storageLength
        if (onCurrentStorageStringLengthChanged) {
            onCurrentStorageStringLengthChanged(storageLength)
        }
    }

    return {
        dumpRawDatabase(): string|undefined {
            const untypedExistingDb = typedLocalStorage.readRaw(moreMessagesDbHandle)

            if (untypedExistingDb) {
                updateLastKnownStrorageLength(untypedExistingDb.value.length)
            }

            return untypedExistingDb?.value
        },
        overrideRawDatabase(database: string) {
            updateLastKnownStrorageLength(database.length)
            typedLocalStorage.writeRaw(database, moreMessagesDbHandle)
        },
        save(db: MoreMessagesDbSchemaV1) {
            const res = typedLocalStorage.write(db, moreMessagesDbHandle)
            updateLastKnownStrorageLength(res.rawLength)
        },
        load(): MoreMessagesDbSchemaV1|undefined {
            const result = typedLocalStorage.read(moreMessagesDbHandle)
            if (result) {
                updateLastKnownStrorageLength(result.rawLength)
                return result.record
            }

            return undefined
        },
        currentStorageStringLength(): number|undefined {
            return lastKnownStorageLength
        },
        addOnCurrentStorageStringLengthChangedHandler(handler) {
            onCurrentStorageStringLengthChanged = handler
        },
    }
}