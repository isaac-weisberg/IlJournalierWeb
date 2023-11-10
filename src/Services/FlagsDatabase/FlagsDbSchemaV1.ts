import { Array, Dictionary, Record, String, Number, Static, Optional } from 'runtypes'

export const FlagsDbSchemaV1EventType = Record({
    enabledFlags: Array(String),
    
    // DON'T USE IT ANYMORE, AS OF VERSION `0.8`,
    // THE "MORE" MESSAGES ARE STORED IN SOME OTHER PLACE
    moreMessages: Optional(Array(String)) 
})

export type FlagsDbSchemaV1Event = Static<typeof FlagsDbSchemaV1EventType>

export const FlagsDbSchemaV1Type = Record({
    knownFlagIds: Array(String),
    events: Dictionary(
        FlagsDbSchemaV1EventType, 
        Number
    )
})

export type FlagsDbSchemaV1 = Static<typeof FlagsDbSchemaV1Type>
