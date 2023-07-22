import { DbSchemaV1, DbSchemaV1Type } from "./DbSchemaV1"

const dbSchemaV1StorageKey = 'flagDbV1'

export interface IFlagsDatabaseStorageService {
    dumpRawDatabase(): string|null
    overrideRawDatabase(database: string): void
    save(db: DbSchemaV1): void
    load(): DbSchemaV1|undefined
    currentStorageStringLength(): number|undefined
    addOnCurrentStorageStringLengthChangedHandler(handler: (length: number) => void): void
}

export function FlagsDatabaseStorageServiceV1(): IFlagsDatabaseStorageService {
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
            const untypedExistingDb = localStorage.getItem(dbSchemaV1StorageKey)

            updateLastKnownStrorageLength(untypedExistingDb)

            return untypedExistingDb
        },
        overrideRawDatabase(database: string) {
            updateLastKnownStrorageLength(database)
            localStorage.setItem(dbSchemaV1StorageKey, database)
        },
        save(db: DbSchemaV1) {
            const string = JSON.stringify(db)
            // Notify
            updateLastKnownStrorageLength(string)
            // Use
            localStorage.setItem(dbSchemaV1StorageKey, string)
        },
        load(): DbSchemaV1|undefined {
            const untypedExistingDb = localStorage.getItem(dbSchemaV1StorageKey)
            let _existingDatabase: DbSchemaV1|undefined
            try {
                if (untypedExistingDb) {
                    // Notify
                    updateLastKnownStrorageLength(untypedExistingDb)
                    // Use
                    const json = JSON.parse(untypedExistingDb)
                    _existingDatabase = DbSchemaV1Type.check(json)
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
