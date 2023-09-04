import { IDIContext } from "../../Services/DI";
import { Deferred } from "../../Util/Deferred";
import { INavigationController } from "../NavigationController/NavigationController";
import { MagicKeyViewerController } from "./MagicKeyViewerController";
import { MagicKeyViewerPresenter } from "./MagicKeyViewerPresenter";

export async function MagicKeyViewerCoordinator(
    loginInfo: string,
    nc: INavigationController,
    di: IDIContext
): Promise<void> {
    const presenter = MagicKeyViewerPresenter(loginInfo)
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