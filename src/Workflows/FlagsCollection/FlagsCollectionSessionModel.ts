import { DbSchemaV1, DbSchemaV1Event, DbSchemaV1EventType, DbSchemaV1Type } from "./DbSchemaV1";
import { IFlagsDatabaseStorageService } from "./FlagsDatabaseStorageServiceV1";

export interface FlagModel {
    id: string
    isEnabled: boolean
}

export interface IFlagsCollectionSessionModel {
    flags(): FlagModel[]
    addFlag(id: string): FlagModel|undefined
    setFlagEnabled(id: string, isEnabled: boolean): void
}

const basicFlagNames = [
    'Грустно',
    'Замечательный день',
    'Дождь', 
    'Жарко',
    'На улице хорошо',
    'Холодно',
    'Прокрастинировал',
    'Обожрался'
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

export function FlagsCollectionSessionModel(databaseStorage: IFlagsDatabaseStorageService): IFlagsCollectionSessionModel {
    const existingDatabase = databaseStorage.load()

    const now = new Date().getTime()

    interface State {
        database: DbSchemaV1
        currentFlagSessionDate: number
        enabledFlags: Set<string>
    }

    let state: State
    if (existingDatabase) {
        const maxDateInDb = findMaxNumber(Object.keys(existingDatabase.events))
        if (maxDateInDb && Math.abs(now - maxDateInDb) < sessionRetainGapMs) {
            const currentFlagSessionDate = maxDateInDb
            let enabledFlags: Set<string>
            try {
                const existingEventObject: DbSchemaV1Event|undefined = existingDatabase.events[currentFlagSessionDate]
                const typedEventObject = DbSchemaV1EventType.check(existingEventObject)
                enabledFlags = new Set(typedEventObject.enabledFlags)
            } catch {
                enabledFlags = new Set()
                existingDatabase.events[currentFlagSessionDate] = { enabledFlags: [] }
            }

            state = {
                currentFlagSessionDate: currentFlagSessionDate,
                enabledFlags: enabledFlags,
                database: existingDatabase
            }
        } else {
            existingDatabase.events[now] = { enabledFlags: [] }
            state = {
                currentFlagSessionDate: now,
                enabledFlags: new Set(),
                database: existingDatabase
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

    // Implemetations

    function addFlag(id: string): FlagModel|undefined {
        if (!state.database.knownFlagIds.includes(id)) {
            state.database.knownFlagIds.push(id)
            databaseStorage.save(state.database)

            const flag = {
                id: id,
                isEnabled: false
            }
            return flag
        }
        return undefined
    }

    function setFlagEnabled(id: string, isEnabled: boolean): void {
        if (isEnabled) {
            state.enabledFlags.add(id)
        } else {
            state.enabledFlags.delete(id)
        }

        state.database.events[state.currentFlagSessionDate].enabledFlags = Array.from(state.enabledFlags)
        databaseStorage.save(state.database)
    }

    return {
        flags(): FlagModel[] {
            return state.database.knownFlagIds.map(id => {
                const isEnabled = state.enabledFlags.has(id)
                return {
                    id: id,
                    isEnabled: isEnabled
                }
            })
        },
        addFlag,
        setFlagEnabled
    }
}