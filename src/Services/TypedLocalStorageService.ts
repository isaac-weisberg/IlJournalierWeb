import { RuntypeBase, Static } from "runtypes/lib/runtype";

export interface ITypedLocalStorageService<RecordType extends RuntypeBase> {
    read(): Static<RecordType>|undefined
    readRaw(): string|undefined
    write(value: Static<RecordType>): void
    writeRaw(value: string): void
    remove(): void

    getCurrentStorageLength(): number|undefined
    setCurrentStorageChangedHandler(handler: (length?: number|undefined) => void): void
}

export function TypedLocalStorageService<RecordType extends RuntypeBase>(storageKey: string, recordType: RecordType): ITypedLocalStorageService<RecordType> {
    let lastKnownStorageLength: number|undefined
    let onCurrentStorageStringLengthChanged: ((length: number|undefined) => void)|undefined

    function updateLastKnownStrorageLength(untypedExistingDbStringLength: number|undefined) {
        const storageLength = untypedExistingDbStringLength
        lastKnownStorageLength = storageLength
        if (onCurrentStorageStringLengthChanged) {
            onCurrentStorageStringLengthChanged(storageLength)
        }
    }

    function write(value: Static<RecordType>) {
        const string = JSON.stringify(value)
        updateLastKnownStrorageLength(string.length)
        localStorage.setItem(storageKey, string)
    }

    function writeRaw(value: string) {
        updateLastKnownStrorageLength(value.length)
        localStorage.setItem(storageKey, value)
    }
    
    function readRaw(): string|undefined {
        const untypedExistingDb = localStorage.getItem(storageKey)
        updateLastKnownStrorageLength(untypedExistingDb?.length)
        return untypedExistingDb || undefined
    }

    function remove(): void {
        updateLastKnownStrorageLength(undefined)
        localStorage.removeItem(storageKey)
    }

    return {
        read(): Static<RecordType>|undefined {
            const untypedExistingDb = localStorage.getItem(storageKey)
            updateLastKnownStrorageLength(untypedExistingDb?.length)
            let _existingDatabase: Static<RecordType>|undefined
            try {
                if (untypedExistingDb) {
                    const json = JSON.parse(untypedExistingDb)
                    const record: Static<RecordType> = recordType.check(json)
                    _existingDatabase = record
                } else {
                    _existingDatabase = undefined
                }
            } catch {
                _existingDatabase = undefined
            }
            return _existingDatabase
        },
        write, writeRaw, readRaw, remove,
        getCurrentStorageLength(): number|undefined {
            return lastKnownStorageLength
        },
        setCurrentStorageChangedHandler(handler: (length: number|undefined) => void) {
            onCurrentStorageStringLengthChanged = handler
        },
    }
}