import { IDIContext } from "../../Services/DI";
import { Deferred } from "../../Util/Deferred";
import { sleep } from "../../Util/Sleep";
import { StylishButton } from "../../Views/StylishButton";
import { StylishTextInput } from "../../Views/StylishTextInput";
import { INavigationController } from "../NavigationController/NavigationController";
import { MagicKeyViewerController } from "./MagicKeyViewerController";
import { MagicKeyViewerPresenter } from "./MagicKeyViewerPresenter";

export async function MagicKeyViewerCoordinator(
    data: {
        magicKey: string,
        saultGoodman: string
    },
    nc: INavigationController,
    di: IDIContext
): Promise<void> {

    const presenter = MagicKeyViewerPresenter(data)
    const magicKeyViewerController = MagicKeyViewerController(presenter, di)

    nc.pushController(magicKeyViewerController)

    const finish = Deferred<void>()

    presenter.navigation = {
        onUserWantsToGoOn: () => {
            finish.resolve()
        }
    }

    return finish.promise
}