import { flagsDbSchemaV1StorageKey } from "../Util/Const"
import { FlagsDbSchemaV1, FlagsDbSchemaV1Type } from "./FlagsDbSchemaV1"
import { ITypedLocalStorageService, ITypedLocalStorageHandle } from "./TypedLocalStorageService"

export interface IFlagsDatabaseStorageService {
    dumpRawDatabase(): string|undefined
    overrideRawDatabase(database: string): void
    save(db: FlagsDbSchemaV1): void
    load(): FlagsDbSchemaV1|undefined
    currentStorageStringLength(): number|undefined
    addOnCurrentStorageStringLengthChangedHandler(handler: (length: number) => void): void
}

const typedLocalStorageSchemaHandle: ITypedLocalStorageHandle<typeof FlagsDbSchemaV1Type> = {
    key: flagsDbSchemaV1StorageKey,
    recordType: FlagsDbSchemaV1Type
}

export function FlagsDatabaseStorageServiceV1(
    typedLocalStorage: ITypedLocalStorageService
): IFlagsDatabaseStorageService {
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
            const dump = typedLocalStorage.readRaw(typedLocalStorageSchemaHandle)
            if (dump) {
                updateLastKnownStrorageLength(dump.value.length)
                return dump.value
            }
            return undefined
        },
        overrideRawDatabase(database: string) {
            updateLastKnownStrorageLength(database.length)
            typedLocalStorage.writeRaw(database, typedLocalStorageSchemaHandle)
        },
        save(db: FlagsDbSchemaV1) {
            const res = typedLocalStorage.write(db, typedLocalStorageSchemaHandle)
            updateLastKnownStrorageLength(res.rawLength)
        },
        load(): FlagsDbSchemaV1|undefined {
            const result = typedLocalStorage.read(typedLocalStorageSchemaHandle)
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
