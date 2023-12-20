import { IThemeService } from "../../../Services/ThemeService";
import { IMessageViewModel, MessageView } from "./MessageView";

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
    })(root.style)

    const scrollContent = document.createElement('div')
    root.appendChild(scrollContent)

    function updateLayout() {
        const numberOfItems = dataSource.numberOfItems()

        let usedUpHeight = 0
        for (let i = 0; i < numberOfItems; i++) {
            const item = dataSource.itemForIndex(i)

            const messageView = MessageView({ themeService: di.themeService })
            messageView.apply(item)

            ;(s => {
                s.left = '0px'
                s.width = '100%'
            })(messageView.root.style)

            scrollContent.appendChild(messageView.root)

            const messageHeight = messageView.root.offsetHeight

            messageView.root.style.top = `${usedUpHeight}px`

            usedUpHeight += messageHeight
        }
    }

    return {
        updateLayout,
        root
    }
}