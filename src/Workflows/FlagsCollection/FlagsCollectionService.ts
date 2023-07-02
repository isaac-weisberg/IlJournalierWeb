import { FlagModel } from "./FlagsCollectionPresenter"
import { Array as RuntypeArray, Dictionary, Record, String, Number, Static } from 'runtypes'

export interface IFlagsCollectionService {
    readonly flags: FlagModel[]
    setEnabled(index: number, isEnabled: boolean): void
}

const flagDbName = 'flagDbV1'

const DbSchemaV1EventType = Record({
    enabledFlags: RuntypeArray(String)
})

const DbSchemaV1Type = Record({
    knownFlagNames: RuntypeArray(String),
    events: Dictionary(
        DbSchemaV1EventType, 
        Number
    )
})

type DbSchemaV1 = Static<typeof DbSchemaV1Type>

const basicFlagNames = [
    'Грустно',
    'Замечательный день',
    'Дождь', 
    'Жарко',
    'На улице хорошо',
    'Холодно',
    'Много прокрастинировал',
    'Ссора с Машей',
    'Тревожусь',
    '"Пиво"',
    'Рокк Ебол'
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

interface FlagsCollectionServiceState {
    knownFlagNames: string[]
    flagSession: {
        enabledFlags: Set<string>,
        date: number
    }
    database: DbSchemaV1
}

function createFlagsCollectionServiceState(): FlagsCollectionServiceState {
    const now = new Date().getTime()

    let knownFlagNames: string[]
    let enabledFlags: string[]
    let currentFlagSessionDate: number

    const untypedExistingDb = localStorage.getItem(flagDbName)
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
    const existingDatabase: DbSchemaV1|undefined = _existingDatabase

    if (existingDatabase) {
        knownFlagNames = existingDatabase.knownFlagNames || basicFlagNames
        const maxDateInDb = findMaxNumber(Object.keys(existingDatabase.events))
        if (maxDateInDb && Math.abs(now - maxDateInDb) < sessionRetainGapMs) {
            currentFlagSessionDate = maxDateInDb
            enabledFlags = existingDatabase.events[maxDateInDb].enabledFlags || []
        } else {
            enabledFlags = []
            currentFlagSessionDate = now

            existingDatabase.events[now] = { enabledFlags: [] }
        }
    } else {
        knownFlagNames = basicFlagNames
        enabledFlags = []
        currentFlagSessionDate = now
    }
    
    const databaseForState: DbSchemaV1 = existingDatabase || {
        knownFlagNames: knownFlagNames,
        events: {
            [currentFlagSessionDate]: {
                enabledFlags: enabledFlags
            }
        }
    }

    return {
        knownFlagNames: knownFlagNames,
        flagSession: {
            enabledFlags: new Set(enabledFlags),
            date: currentFlagSessionDate
        },
        database: databaseForState
    }
}

export function FlagsCollectionService(): IFlagsCollectionService {
    const state = createFlagsCollectionServiceState()

    const flags: FlagModel[] = state.knownFlagNames.map(flagName => {
        return {
            label: flagName,
            isEnabled: state.flagSession.enabledFlags.has(flagName)
        }
    })

    function setEnabled(index: number, isEnabled: boolean) {
        if (isEnabled) {
            state.flagSession.enabledFlags.add(state.knownFlagNames[index])
        } else {
            state.flagSession.enabledFlags.delete(state.knownFlagNames[index])
        }

        state.database.events[state.flagSession.date].enabledFlags = Array.from(state.flagSession.enabledFlags)
        localStorage.setItem(flagDbName, JSON.stringify(state.database))
    }

    return {
        flags: flags,
        setEnabled: setEnabled
    }
}