import { Array as RuntypeArray, Dictionary, Record, String, Number, Static, Optional } from 'runtypes'

export const DbSchemaV1EventType = Record({
    enabledFlags: RuntypeArray(String),
    moreMessages: Optional(RuntypeArray(String))
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
