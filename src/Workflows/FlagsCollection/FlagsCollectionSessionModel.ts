import { FlagsDbSchemaV1, FlagsDbSchemaV1Event, FlagsDbSchemaV1EventType } from "../../Services/FlagsDatabase/FlagsDbSchemaV1";
import { ICommonDIContext } from "../../Services/DI";
import { Bus, IBus } from "../../Util/Bus";
import { IFlagsDatabaseLocalStorage } from "../../Services/FlagsDatabase/FlagsDatabaseLocalStorage";

export interface FlagModel {
    id: string
    isEnabled: boolean
}

export interface IFlagsCollectionSessionModel {
    flags(): FlagModel[]
    addFlag(id: string): FlagModel|undefined
    setFlagEnabled(id: string, isEnabled: boolean): void
    onFlagsUpdatedBus: IBus<void>
    getLegacyMessages(): LegacyMessage[]
}

interface LegacyMessage {
    unixSeconds: number, msg: string 
}

const basicFlagNames = [
    'Замечательный день',
    'Дождь', 
    'Жарко',
    'На улице хорошо',
    'Холодно',
    'Тревожусь',
    'Грущу',
    'Прокрастинирую',
    'Обжираюсь',
]

const sessionRetainGapMs = 3600000 // 1 hour in ms

function findMaxNumber(iterable: string[]): number | undefined {
    let maxNumber: number | undefined
    for (const string of iterable) {
        const parsedNumber = parseInt(string, 10)
        if (isNaN(parsedNumber)) {
            continue
        }
        const number = parsedNumber
        if (maxNumber) {
            if (number > maxNumber) {
                maxNumber = number
            }
        } else {
            maxNumber = number
        }
    }
    return maxNumber
}

interface FlagsState {
    database: FlagsDbSchemaV1
    currentFlagSessionDate: number
    enabledFlags: Set<string>
}

function createInitialFlagState(flagsDatabaseStorage: IFlagsDatabaseLocalStorage) {
    const now = new Date().getTime()
    const existingFlagsDatabase = flagsDatabaseStorage.read()

    let state: FlagsState
    if (existingFlagsDatabase) {
        const maxDateInDb = findMaxNumber(Object.keys(existingFlagsDatabase.events))
        if (maxDateInDb && Math.abs(now - maxDateInDb) < sessionRetainGapMs) {
            const currentFlagSessionDate = maxDateInDb
            let enabledFlags: Set<string>
            try {
                const existingEventObject: FlagsDbSchemaV1Event|undefined = existingFlagsDatabase.events[currentFlagSessionDate]
                const typedEventObject = FlagsDbSchemaV1EventType.check(existingEventObject)
                enabledFlags = new Set(typedEventObject.enabledFlags)
            } catch {
                enabledFlags = new Set()
                existingFlagsDatabase.events[currentFlagSessionDate] = { enabledFlags: [] }
            }

            state = {
                currentFlagSessionDate: currentFlagSessionDate,
                enabledFlags: enabledFlags,
                database: existingFlagsDatabase
            }
        } else {
            existingFlagsDatabase.events[now] = { enabledFlags: [] }
            state = {
                currentFlagSessionDate: now,
                enabledFlags: new Set(),
                database: existingFlagsDatabase
            }
        }
    } else {
        state = {
            currentFlagSessionDate: now,
            enabledFlags: new Set(),
            database: {
                knownFlagIds: basicFlagNames,
                events: {
                    [now]: {
                        enabledFlags: []
                    }
                }
            }
        }
    }

    return state
}

export function FlagsCollectionSessionModel(
    diContext: ICommonDIContext
): IFlagsCollectionSessionModel {
    const onFlagsUpdatedBus = Bus<void>()

    let flagsState = createInitialFlagState(diContext.flagsDatabaseStorage)

    function reloadFlagsState() {
        const now = new Date().getTime()
        if (Math.abs(now - flagsState.currentFlagSessionDate) > sessionRetainGapMs) { // i.e., an hour passed
            flagsState = createInitialFlagState(diContext.flagsDatabaseStorage)
            onFlagsUpdatedBus.post()
        }
    }

    diContext.visibilityChangeService.bus.addHandler(visibilityState => {
        switch (visibilityState) {
        case "visible":
            reloadFlagsState()
        case "hidden":
        }
    })

    return {
        flags(): FlagModel[] {
            return flagsState.database.knownFlagIds.map(id => {
                const isEnabled = flagsState.enabledFlags.has(id)
                return {
                    id: id,
                    isEnabled: isEnabled
                }
            })
        },
        addFlag(id: string): FlagModel|undefined {
            if (!flagsState.database.knownFlagIds.includes(id)) {
                flagsState.database.knownFlagIds.push(id)
                diContext.flagsDatabaseStorage.write(flagsState.database)
    
                const flag = {
                    id: id,
                    isEnabled: false
                }
                return flag
            }
            return undefined
        },
        setFlagEnabled(id: string, isEnabled: boolean): void {
            if (isEnabled) {
                flagsState.enabledFlags.add(id)
            } else {
                flagsState.enabledFlags.delete(id)
            }
    
            flagsState.database.events[flagsState.currentFlagSessionDate].enabledFlags = Array.from(flagsState.enabledFlags)
            diContext.flagsDatabaseStorage.write(flagsState.database)
        },
        onFlagsUpdatedBus,
        getLegacyMessages() {
            let messages: LegacyMessage[] = []

            let iteration = -1
            for (const key of Object.keys(flagsState.database.events)) {
                iteration++

                const keyNumber = Number(key)

                if (isNaN(keyNumber)) {
                    alert(`getLegacyMessages fatal at iteration '${iteration}'`)
                    return []
                }

                const flagEntry = flagsState.database.events[keyNumber]

                if (flagEntry.moreMessages) {
                    const unixSeconds = Math.round(keyNumber / 1000)
                    for (const message of flagEntry.moreMessages) {
                        messages.push({
                            unixSeconds,
                            msg: message
                        })
                    }
                }
            }

            return messages
        }
    }
}