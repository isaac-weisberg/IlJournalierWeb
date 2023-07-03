import { DbSchemaV1, DbSchemaV1Type } from "./DbSchemaV1"

const dbSchemaV1StorageKey = 'flagDbV1'

export interface IFlagsDatabaseStorageService {
    save(db: DbSchemaV1): void
    load(): DbSchemaV1|undefined
}

export function FlagsDatabaseStorageServiceV1(): IFlagsDatabaseStorageService {
    return {
        save(db: DbSchemaV1) {
            localStorage.setItem(dbSchemaV1StorageKey, JSON.stringify(db))
        },
        load(): DbSchemaV1|undefined {
            const untypedExistingDb = localStorage.getItem(dbSchemaV1StorageKey)
            let _existingDatabase: DbSchemaV1|undefined
            try {
                if (untypedExistingDb) {
                    const json = JSON.parse(untypedExistingDb)
                    _existingDatabase = DbSchemaV1Type.check(json)
                } else {
                    _existingDatabase = undefined
                }
            } catch {
                _existingDatabase = undefined
            }
            return _existingDatabase
        }
    }
}
