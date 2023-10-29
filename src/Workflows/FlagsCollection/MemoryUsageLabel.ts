import { StringLengthFormatter } from "../../Extensions/StringLengthFormatter"
import { ICommonDIContext } from "../../Services/DI"

export interface IMemoryUsageLabel {
    root: HTMLDivElement
}

export function MemoryUsageLabel(
    diContext: ICommonDIContext
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

    let flagsKnownLength = diContext.flagsDatabaseStorage.getCurrentStorageLength()
    let moreMessagesKnownLength = diContext.moreMessagesDbStorage.getCurrentStorageLength() 

    diContext.flagsDatabaseStorage.setCurrentStorageChangedHandler((length) => {
        flagsKnownLength = length
        calcAndUpdateText()
    })

    diContext.moreMessagesDbStorage.setCurrentStorageChangedHandler((length) => {
        moreMessagesKnownLength = length
        calcAndUpdateText()
    })

    function totalKnownLength() {
        let total: number|undefined
        for (const value of [flagsKnownLength, moreMessagesKnownLength]) {
            if (value) {
                if (total) {
                    total += value
                } else {
                    total = value
                }
            }
        }
        return total
    }

    function calcAndUpdateText() {
        const length = totalKnownLength()
        setTextInDiv(length)
    }

    calcAndUpdateText()
    memoryUsageTextNode.style.display = 'inline-block'

    return {
        root: memoryUsageTextNode
    }
}