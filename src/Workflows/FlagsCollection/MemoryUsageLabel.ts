import { StringLengthFormatter } from "../../Extensions/StringLengthFormatter"
import { IFlagsDatabaseStorageService } from "./FlagsDatabaseStorageServiceV1"

export interface IMemoryUsageLabel {
    root: HTMLDivElement
}

export function MemoryUsageLabel(storageService: IFlagsDatabaseStorageService): IMemoryUsageLabel{
    const memoryUsageTextNode = document.createElement('div')

    function setText(storageLength: number|undefined) {
        if (storageLength) {
            const formattedLength = StringLengthFormatter(storageLength)

            memoryUsageTextNode.textContent = `Storage used: ${formattedLength} symbols`
        }
    }

    const storageLength = storageService.currentStorageStringLength()
    setText(storageLength)

    storageService.onCurrentStorageStringLengthChanged = (length) => {
        setText(length)
    }

    memoryUsageTextNode.style.display = 'inline-block'

    return {
        root: memoryUsageTextNode
    }
}