import { FlagsDbSchemaV1, FlagsDbSchemaV1Event, FlagsDbSchemaV1EventType, FlagsDbSchemaV1Type } from "../../Services/FlagsDbSchemaV1";
import { IFlagsDatabaseStorageService } from "../../Services/FlagsDatabaseStorageServiceV1";
import { MoreMessagesDbSchemaV1 } from "../../Services/MoreMessagesDbSchemaV1";
import { IMoreMessagesStorageService } from "../../Services/MoreMessagesStorageService";
import { IVisibilityChangeService } from "../../Services/VisibilityChangeService";
import { IDIContext } from "../../Services/DI";

export interface FlagModel {
    id: string
    isEnabled: boolean
}

export interface IFlagsCollectionSessionModel {
    flags(): FlagModel[]
    addFlag(id: string): FlagModel|undefined
    setFlagEnabled(id: string, isEnabled: boolean): void
    addMoreMessage(message: string): void
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

interface MoreMessagesState {
    database: MoreMessagesDbSchemaV1
}

function createInitialMoreMessagesState(moreMessagesDbStorage: IMoreMessagesStorageService): MoreMessagesState {
    const existingMoreMessagesDb = moreMessagesDbStorage.load()
    if (existingMoreMessagesDb) {
        return {
            database: existingMoreMessagesDb
        }
    } else {
        return {
            database: {
                messages: {

                }
            }
        }
    }
}

interface FlagsState {
    database: FlagsDbSchemaV1
    currentFlagSessionDate: number
    enabledFlags: Set<string>
}

function createInitialFlagState(flagsDatabaseStorage: IFlagsDatabaseStorageService) {
    const now = new Date().getTime()
    const existingFlagsDatabase = flagsDatabaseStorage.load()

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
    diContext: IDIContext
): IFlagsCollectionSessionModel {
    let moreMessagesState = createInitialMoreMessagesState(diContext.moreMessagesDbStorage)
    let flagsState: FlagsState

    function reloadFlagsState() {
        flagsState = createInitialFlagState(diContext.flagsDatabaseStorage)
    }
    
    reloadFlagsState()

    let firstVisibilityFired = false
    diContext.visibilityChangeService.addHandler(visibilityState => {
        switch (visibilityState) {
        case "visible":
            if (firstVisibilityFired) {
                reloadFlagsState()
            }
            firstVisibilityFired = true
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
                diContext.flagsDatabaseStorage.save(flagsState.database)
    
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
            diContext.flagsDatabaseStorage.save(flagsState.database)
        },
        addMoreMessage(message: string) {
            const now = new Date().getTime()
            moreMessagesState.database.messages[now] = message
    
            diContext.moreMessagesDbStorage.save(moreMessagesState.database)
        }
    }
}