import { StringLengthFormatter } from "../../../Extensions/StringLengthFormatter"
import { IMemoryUsageLabelPresenter } from "./MemoryUsageLabelPresenter"

export interface IMemoryUsageLabel {
    root: HTMLDivElement
}

export function MemoryUsageLabel(
    presenter: IMemoryUsageLabelPresenter
): IMemoryUsageLabel{
    const memoryUsageTextNode = document.createElement('div')

    function setTextInDiv(storageLength: number|undefined) {
        if (storageLength) {
            const formattedLength = StringLengthFormatter(storageLength)
            memoryUsageTextNode.textContent = `Storage used: ${formattedLength} symbols`
        } else {
            memoryUsageTextNode.textContent = `Storage used: I guess none`
        }
    }

    memoryUsageTextNode.style.display = 'inline-block'

    presenter.memoryUsageChangedBus.addHandler((length) => {
        setTextInDiv(length)
    })

    presenter.calculateAndUpdate()

    return {
        root: memoryUsageTextNode
    }
}