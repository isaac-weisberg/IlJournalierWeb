import { IThemeService } from "../../Services/ThemeService"
import { StylishButton } from "../../Views/StylishButton"
import { StylishTextInput } from "../../Views/StylishTextInput"
import './ReadWriteDbWidget.css'

export interface IReadWriteDbWidget {
    root: HTMLDivElement
}

export interface ReaderWriter {
    readString(): string|null
    writeString(value: string): void
}

export function ReadWriteDbWidget(
    dbName: string, 
    readerWriter: ReaderWriter, 
    themeService: IThemeService
): IReadWriteDbWidget {
    const div = document.createElement('div')
    div.className = 'rwdbwidget'

    const rawDbTextField = StylishTextInput({ 
        overridePlaceholder: `Value of ${dbName}`,
        fontSize: '120%',
        readOnly: false,
        themeService
    })
    
    const loadValueButton  = StylishButton({ 
        title: `Load ${dbName}`, 
        themeService, 
        fontSize: '150%',
        handler: () => {
            const rawDb = readerWriter.readString()
            rawDbTextField.setValue(rawDb || '')
        }
    })

    const saveValueButton = StylishButton({
        title: `Save ${dbName}`, 
        themeService, 
        fontSize: '150%',
        handler: () => {
            const value = rawDbTextField.value()
            readerWriter.writeString(value)
        }
    })

    div.appendChild(loadValueButton.root)
    div.appendChild(saveValueButton.root)
    div.appendChild(rawDbTextField.root)

    return {
        root: div
    }
}