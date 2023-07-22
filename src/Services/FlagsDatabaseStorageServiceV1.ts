import { flagsDbSchemaV1StorageKey } from "../Util/Const"
import { FlagsDbSchemaV1, FlagsDbSchemaV1Type } from "./FlagsDbSchemaV1"

export interface IFlagsDatabaseStorageService {
    dumpRawDatabase(): string|null
    overrideRawDatabase(database: string): void
    save(db: FlagsDbSchemaV1): void
    load(): FlagsDbSchemaV1|undefined
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
            const untypedExistingDb = localStorage.getItem(flagsDbSchemaV1StorageKey)

            updateLastKnownStrorageLength(untypedExistingDb)

            return untypedExistingDb
        },
        overrideRawDatabase(database: string) {
            updateLastKnownStrorageLength(database)
            localStorage.setItem(flagsDbSchemaV1StorageKey, database)
        },
        save(db: FlagsDbSchemaV1) {
            const string = JSON.stringify(db)
            // Notify
            updateLastKnownStrorageLength(string)
            // Use
            localStorage.setItem(flagsDbSchemaV1StorageKey, string)
        },
        load(): FlagsDbSchemaV1|undefined {
            const untypedExistingDb = localStorage.getItem(flagsDbSchemaV1StorageKey)
            let _existingDatabase: FlagsDbSchemaV1|undefined
            try {
                if (untypedExistingDb) {
                    // Notify
                    updateLastKnownStrorageLength(untypedExistingDb)
                    // Use
                    const json = JSON.parse(untypedExistingDb)
                    _existingDatabase = FlagsDbSchemaV1Type.check(json)
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
