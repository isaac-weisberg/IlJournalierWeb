import { moreMessagesDbSchemaV1StorageKey } from '../Util/Const'
import { MoreMessagesDbSchemaV1Type, MoreMessagesDbSchemaV1 } from './MoreMessagesDbSchemaV1'

export interface IMoreMessagesStorageService {
    dumpRawDatabase(): string|null
    overrideRawDatabase(database: string): void
    save(db: MoreMessagesDbSchemaV1): void
    load(): MoreMessagesDbSchemaV1|undefined
    currentStorageStringLength(): number|undefined
    addOnCurrentStorageStringLengthChangedHandler(handler: (length: number) => void): void
}

export function MoreMessagesStorageService(): IMoreMessagesStorageService {
    let lastKnownStorageLength: number|undefined
    let onCurrentStorageStringLengthChanged: ((length: number) => void)|undefined

    function updateLastKnownStrorageLength(untypedExistingDbString: string|null|undefined) {
        if (untypedExistingDbString) {
            const storageLength = untypedExistingDbString.length
            lastKnownStorageLength = storageLength
            if (onCurrentStorageStringLengthChanged) {
                onCurrentStorageStringLengthChanged(storageLength)
            }
        }
    }

    return {
        dumpRawDatabase(): string|null {
            const untypedExistingDb = localStorage.getItem(moreMessagesDbSchemaV1StorageKey)

            updateLastKnownStrorageLength(untypedExistingDb)

            return untypedExistingDb
        },
        overrideRawDatabase(database: string) {
            updateLastKnownStrorageLength(database)
            localStorage.setItem(moreMessagesDbSchemaV1StorageKey, database)
        },
        save(db: MoreMessagesDbSchemaV1) {
            const string = JSON.stringify(db)
            // Notify
            updateLastKnownStrorageLength(string)
            // Use
            localStorage.setItem(moreMessagesDbSchemaV1StorageKey, string)
        },
        load(): MoreMessagesDbSchemaV1|undefined {
            const untypedExistingDb = localStorage.getItem(moreMessagesDbSchemaV1StorageKey)
            let _existingDatabase: MoreMessagesDbSchemaV1|undefined
            try {
                if (untypedExistingDb) {
                    // Notify
                    updateLastKnownStrorageLength(untypedExistingDb)
                    // Use
                    const json = JSON.parse(untypedExistingDb)
                    _existingDatabase = MoreMessagesDbSchemaV1Type.check(json)
                } else {
                    _existingDatabase = undefined
                }
            } catch {
                _existingDatabase = undefined
            }
            return _existingDatabase
        },
        currentStorageStringLength(): number|undefined {
            return lastKnownStorageLength
        },
        addOnCurrentStorageStringLengthChangedHandler(handler) {
            onCurrentStorageStringLengthChanged = handler
        },
    }
}