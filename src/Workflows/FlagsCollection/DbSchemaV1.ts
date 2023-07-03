import { Array as RuntypeArray, Dictionary, Record, String, Number, Static } from 'runtypes'

export const DbSchemaV1EventType = Record({
    enabledFlags: RuntypeArray(String)
})

export type DbSchemaV1Event = Static<typeof DbSchemaV1EventType>

export const DbSchemaV1Type = Record({
    knownFlagIds: RuntypeArray(String),
    events: Dictionary(
        DbSchemaV1EventType, 
        Number
    )
})

export type DbSchemaV1 = Static<typeof DbSchemaV1Type>
