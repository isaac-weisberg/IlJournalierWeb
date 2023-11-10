import { IThemeService } from "../../Services/ThemeService"
import { ISendAwayLegacyMessagesPresenter } from "./SendAwayLegacyMessagesWidget/SendAwayLegacyMessagesPresenter"
import { SendAwayLegacyMessagesWidget } from "./SendAwayLegacyMessagesWidget/SendAwayLegacyMessagesWidget"

export interface IDevPanelPresenter {
    sendAwayLegacyMessagesPresenter: ISendAwayLegacyMessagesPresenter
}

export function DevPanelPresenter(
    sendAwayLegacyMessagesPresenter: ISendAwayLegacyMessagesPresenter
): IDevPanelPresenter {
    return {
        sendAwayLegacyMessagesPresenter
    }
}