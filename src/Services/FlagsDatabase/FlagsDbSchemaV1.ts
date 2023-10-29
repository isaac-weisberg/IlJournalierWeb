import { Array as RuntypeArray, Dictionary, Record, String, Number, Static } from 'runtypes'

export const FlagsDbSchemaV1EventType = Record({
    enabledFlags: RuntypeArray(String),
    
    // DON'T USE IT ANYMORE, AS OF VERSION `0.8`,
    // THE "MORE" MESSAGES ARE STORED IN SOME OTHER PLACE
    // moreMessages: Optional(RuntypeArray(String)) 
})

export type FlagsDbSchemaV1Event = Static<typeof FlagsDbSchemaV1EventType>

export const FlagsDbSchemaV1Type = Record({
    knownFlagIds: RuntypeArray(String),
    events: Dictionary(
        FlagsDbSchemaV1EventType, 
        Number
    )
})

export type FlagsDbSchemaV1 = Static<typeof FlagsDbSchemaV1Type>
