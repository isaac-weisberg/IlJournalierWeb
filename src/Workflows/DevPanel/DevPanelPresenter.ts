import { IThemeService } from "../../Services/ThemeService"
import { ISendAwayLegacyMessagesPresenter, SendAwayLegacyMessagesPresenter } from "./SendAwayLegacyMessagesWidget/SendAwayLegacyMessagesPresenter"
import { SendAwayLegacyMessagesWidget } from "./SendAwayLegacyMessagesWidget/SendAwayLegacyMessagesWidget"

export interface IDevPanelPresenter {
    sendAwayLegacyMessagesPresenter: ISendAwayLegacyMessagesPresenter
}

export function DevPanelPresenter(
    themeService: IThemeService
): IDevPanelPresenter {
    return {
        sendAwayLegacyMessagesPresenter: SendAwayLegacyMessagesPresenter(themeService)
    }
}