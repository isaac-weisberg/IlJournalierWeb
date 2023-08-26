import { Deferred } from "../../Util/Deferred";
import { sleep } from "../../Util/Sleep";
import { INavigationController } from "../NavigationController/NavigationController";

export async function MagicKeyViewerCoordinator(
    magicKey: string,
    nc: INavigationController
): Promise<void> {
    const div = document.createElement('div')

    div.textContent = magicKey

    nc.pushController({root: div})


    await sleep(2000)

    return 

    const deferred = Deferred<void>()

    return deferred.promise
}