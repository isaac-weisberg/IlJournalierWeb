import { DbSchemaV1, DbSchemaV1Type } from "./DbSchemaV1"

const dbSchemaV1StorageKey = 'flagDbV1'

export interface IFlagsDatabaseStorageService {
    save(db: DbSchemaV1): void
    load(): DbSchemaV1|undefined
    currentStorageStringLength(): number|undefined
    onCurrentStorageStringLengthChanged: ((length: number) => void)|undefined
}

export function FlagsDatabaseStorageServiceV1(): IFlagsDatabaseStorageService {
    let lastKnownStorageLength: number|undefined

    return {
        save(db: DbSchemaV1) {
            localStorage.setItem(dbSchemaV1StorageKey, JSON.stringify(db))
        },
        load(): DbSchemaV1|undefined {
            const untypedExistingDb = localStorage.getItem(dbSchemaV1StorageKey)
            let _existingDatabase: DbSchemaV1|undefined
            try {
                if (untypedExistingDb) {
                    // Notify
                    const storageLength = untypedExistingDb.length
                    lastKnownStorageLength = storageLength
                    if (this.onCurrentStorageStringLengthChanged) {
                        this.onCurrentStorageStringLengthChanged(storageLength)
                    }
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
        onCurrentStorageStringLengthChanged: undefined
    }
}
