import { IThemeService, Styling } from "../../../Services/ThemeService"

export type IMessageViewModelKindDateLabel = 'IMessageViewModelKindDateLabel'
export type IMessageViewModelKindMessage = 'IMessageViewModelKindMessage'
export type IMessageViewModelKind = IMessageViewModelKindMessage | IMessageViewModelKindDateLabel

export interface IMessageViewModelDateLabel {
    kind: IMessageViewModelKindDateLabel,
    dateLabel: string
}

export interface IMessageViewModelMessage {
    kind: IMessageViewModelKindMessage
    timeText: string
    message: string
}

export type IMessageViewModel = IMessageViewModelMessage | IMessageViewModelDateLabel

export interface IMessageView {
    root: HTMLDivElement,
    deinit(): void
    apply(viewModel: IMessageViewModelMessage): void
}

export function MessageView(di: {
    themeService: IThemeService
}): IMessageView {
    const root = document.createElement('div')
    root.style.display = 'flex'
    root.style.flexDirection = 'row'
    root.style.transition = '0.25s'
    root.style.padding = '8px 16px'

    const timeLabel = document.createElement('div')
    timeLabel.style.opacity = '70%'
    timeLabel.style.marginRight = '10px'

    root.appendChild(timeLabel)

    const textLabel = document.createElement('div')

    root.appendChild(textLabel)

    function updateStyling(s: Styling) {
        root.style.backgroundColor = s[0]
        timeLabel.style.color = s[1]
        textLabel.style.color = s[1]
    }

    updateStyling(di.themeService.getCurrentStyling())
    const themeHandler = (s: Styling) => updateStyling(s)
    di.themeService.addChangeListener(themeHandler)

    function deinit() {
        di.themeService.rmChangeListener(themeHandler)
    }

    return {
        root: root,
        deinit,
        apply(viewModel) {
            timeLabel.textContent = viewModel.timeText
            textLabel.textContent = viewModel.message
        },
    }
}