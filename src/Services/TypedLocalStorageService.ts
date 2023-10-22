import { RuntypeBase, Static } from "runtypes/lib/runtype";

export interface ITypedLocalStorageHandle<RecordType extends RuntypeBase> {
    key: string,
    recordType: RecordType
}

export function TypedLocalStorageHandle<RecordType extends RuntypeBase>(key: string, recordType: RecordType): ITypedLocalStorageHandle<RecordType> {
    return {
        key, recordType
    }
}

export interface ITypedLocalStorageService {
    read<RecordType extends RuntypeBase>(handle: ITypedLocalStorageHandle<RecordType>): { record: Static<RecordType>, rawLength: number }|undefined
    readRaw<RecordType extends RuntypeBase>(handle: ITypedLocalStorageHandle<RecordType>): { value: string }|undefined
    write<RecordType extends RuntypeBase>(value: Static<RecordType>, handle: ITypedLocalStorageHandle<RecordType>): {rawLength: number}
    writeRaw<RecordType extends RuntypeBase>(value: string, handle: ITypedLocalStorageHandle<RecordType>): void
    remove<RecordType extends RuntypeBase>(handle: ITypedLocalStorageHandle<RecordType>): void
}

export function TypedLocalStorageService(): ITypedLocalStorageService {
    function read<RecordType extends RuntypeBase>(handle: ITypedLocalStorageHandle<RecordType>): { record: Static<RecordType>, rawLength: number }|undefined {
        const untypedExistingDb = localStorage.getItem(handle.key)
        let _existingDatabase: { record: Static<RecordType>, rawLength: number }|undefined
        try {
            if (untypedExistingDb) {
                const json = JSON.parse(untypedExistingDb)
                const record: Static<RecordType> = handle.recordType.check(json)
                _existingDatabase = {
                    record: record,
                    rawLength: untypedExistingDb.length
                }
            } else {
                _existingDatabase = undefined
            }
        } catch {
            _existingDatabase = undefined
        }
        return _existingDatabase
    }

    function write<RecordType extends RuntypeBase>(value: Static<RecordType>, handle: ITypedLocalStorageHandle<RecordType>): {rawLength: number} {
        const string = JSON.stringify(value)
        localStorage.setItem(handle.key, string)

        return {
            rawLength: string.length
        }
    }

    function writeRaw<RecordType extends RuntypeBase>(value: string, handle: ITypedLocalStorageHandle<RecordType>) {
        localStorage.setItem(handle.key, value)
    }
    
    function readRaw<RecordType extends RuntypeBase>(handle: ITypedLocalStorageHandle<RecordType>): { value: string }|undefined {
        const untypedExistingDb = localStorage.getItem(handle.key)
        if (untypedExistingDb) {
            return {
                value: untypedExistingDb
            }
        }
        return undefined
    }

    function remove<RecordType extends RuntypeBase>(handle: ITypedLocalStorageHandle<RecordType>): void {
        localStorage.removeItem(handle.key)
    }

    return {
        read, write, writeRaw, readRaw, remove
    }
}