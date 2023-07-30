import { Static } from "runtypes";
import { RuntypeBase } from "runtypes/lib/runtype";
import { wA, wS } from "./ErrorExtensions";


export async function parseJson<RecordType extends RuntypeBase>(response: Response, record: RecordType): Promise<Static<typeof record>> {
    const json = await wA("parsing response json body failed", async () => {
        return await response.json()
    })

    const recordInstance = wS("response json body was not validated", () => {
        return record.check(json)
    })

    return recordInstance
}