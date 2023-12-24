import { IThemeService } from "../../../Services/ThemeService";
import { IMessageDateView, MessageDateView } from "./MessageDateView";
import { IMessageView, IMessageViewModel, MessageView } from "./MessageView";

export interface IMessageListViewDataSource {
    numberOfItems(): number

    itemForIndex(index: number): IMessageViewModel
}

export interface IMessageListView {
    root: HTMLDivElement

    updateLayout(): void
}

export function MessageListView(
    dataSource: IMessageListViewDataSource,
    di: {
        themeService: IThemeService
    }
): IMessageListView {
    const root = document.createElement('div')
    root.id = 'scrollinRoot'

    ;((s) => {
        s.overflow = 'scroll'
        s.maxWidth = '600px'
    })(root.style)

    const scrollContent = document.createElement('div')
    root.appendChild(scrollContent)

    function updateLayout() {
        const numberOfItems = dataSource.numberOfItems()

        let usedUpHeight = 0
        for (let i = 0; i < numberOfItems; i++) {
            const item = dataSource.itemForIndex(i)

            let cellView: IMessageView|IMessageDateView
            switch (item.kind) {
            case 'IMessageViewModelKindMessage':
                const messageView = MessageView({ themeService: di.themeService })
                messageView.apply(item)
                cellView = messageView
                break
            case 'IMessageViewModelKindDateLabel':
                const messageDateView = MessageDateView({ themeService: di.themeService })

                messageDateView.applyViewModel(item)

                cellView = messageDateView
                break
            }

            ;(s => {
                s.left = '0px'
                s.width = '100%'
            })(cellView.root.style)

            scrollContent.appendChild(cellView.root)

            const messageHeight = cellView.root.offsetHeight

            cellView.root.style.top = `${usedUpHeight}px`

            usedUpHeight += messageHeight
        }
    }

    return {
        updateLayout,
        root
    }
}