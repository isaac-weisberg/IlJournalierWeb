import { IThemeService, Styling } from "../../../Services/ThemeService"
import { IMessageViewModelDateLabel } from "./MessageView"

export interface IMessageDateView {
    root: HTMLDivElement
    deinit(): void
    applyViewModel(vm: IMessageViewModelDateLabel): void
}


export function MessageDateView(di: { themeService: IThemeService }): IMessageDateView {
    const root = document.createElement('div')

    root.style.textAlign = 'center'
    root.style.transition = '0.25s'

    function updateStyling(s: Styling) {
        root.style.backgroundColor = s[0]
        root.style.color = s[1]
    }

    updateStyling(di.themeService.getCurrentStyling())
    const themeHandler = (s: Styling) => updateStyling(s)
    di.themeService.addChangeListener(themeHandler)

    function deinit() {
        di.themeService.rmChangeListener(themeHandler)
    }

    return {
        root,
        deinit,
        applyViewModel(vm) {
            root.textContent = vm.dateLabel        
        },
    }
}