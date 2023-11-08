import { Dictionary, Record, String, Number, Static } from 'runtypes'

export const MoreMessagesOldDbSchemaV1Type = Record({
    messages: Dictionary(
        String,
        Number
    )
})

export type MoreMessagesOldDbSchemaV1 = Static<typeof MoreMessagesOldDbSchemaV1Type>
