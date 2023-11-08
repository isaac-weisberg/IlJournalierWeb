import { RuntypeBase, Static } from "runtypes/lib/runtype"
import { nextEventCycle } from "../MoreMessagesLocalBackup.ts/MoreMessagesLocalBackupService"
import { ITypedLocalStorageService } from "../TypedLocalStorageService"

export interface IRamCachedTypedLocalStorage<RecordType extends RuntypeBase, DefaultValue extends Static<RecordType>> {
    read(): Static<RecordType>|DefaultValue
    write(val: Static<RecordType>): Promise<void>
}

export function RamCachedTypedLocalStorage<
    RecordType extends RuntypeBase,
    DefaultValue extends Static<RecordType>
>(
    localStorage: ITypedLocalStorageService<RecordType>,
    defaultValue: DefaultValue
): IRamCachedTypedLocalStorage<RecordType, DefaultValue> {
    let object = localStorage.read()

    let syncScheduled = false
    async function sync() {
        if (syncScheduled) {
            return
        }

        syncScheduled = true

        await nextEventCycle()

        localStorage.write(object)

        syncScheduled = false
    }

    return {
        read() {
            return object || defaultValue
        },
        async write(val) {
            object = val

            await sync()
        }
    }
}

