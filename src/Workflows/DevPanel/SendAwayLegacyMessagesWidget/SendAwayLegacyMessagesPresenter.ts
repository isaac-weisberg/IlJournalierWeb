import { IThemeService } from "../../../Services/ThemeService"

export interface ISendAwayLegacyMessagesPresenter {
    sendAwayLegacyMessages(): Promise<void>
    themeService: IThemeService
}

export function SendAwayLegacyMessagesPresenter(
    themeService: IThemeService
): ISendAwayLegacyMessagesPresenter {
    return {
        async sendAwayLegacyMessages() {
            
        },
        themeService
    }
}