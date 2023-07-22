import { Dictionary, Record, String, Number, Static } from 'runtypes'

export const MoreMessagesDbSchemaV1Type = Record({
    messages: Dictionary(
        String,        
        Number
    )
})

export type MoreMessagesDbSchemaV1 = Static<typeof MoreMessagesDbSchemaV1Type>
