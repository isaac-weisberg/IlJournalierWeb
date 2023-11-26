import { IConsoleBus } from "../../Services/ConsoleBus/ConsoleBus"
import { IThemeService, Styling } from "../../Services/ThemeService"

export interface IConsolePanel {
    root: HTMLDivElement
}

export function ConsolePanel(
    themeService: IThemeService, 
    bus: IConsoleBus
): IConsolePanel {
    const div = document.createElement('div')

    const st = div.style
    st.display = 'flex'
    st.position = 'absolute'
    st.width = '100vw'
    st.transition = '0.25s'
    // st.height = '45px'
    st.bottom = '90px'
    st.left = '0px'
    st.flexDirection = 'column'
    

    function recolor(styling: Styling) {
        div.style.backgroundColor = styling[0]
    }

    themeService.addChangeListener((styling) => {
        recolor(styling)
    })

    recolor(themeService.getCurrentStyling())

    function text(txt: string) {
        const label = document.createElement('div')
        label.style.textAlign = 'end'
        label.style.margin = '8px 16px'
        label.style.transition = '0.25s'
        label.style.whiteSpace = 'pre-wrap'

        label.textContent = txt

        function recolor(styling: Styling) {
            label.style.color = styling[1]
        }
        recolor(themeService.getCurrentStyling())
        const listener = (s: Styling) => recolor(s)
        themeService.addChangeListener(listener)
        const destroy = () => {
            themeService.rmChangeListener(listener)
        }

        return {
            div: label,
            destroy
        }
    }

    bus.handler = function(msg) {
        const textNode = text(msg)
        
        setTimeout(() => {
            div.removeChild(textNode.div)
            textNode.destroy()
        }, 5000)

        div.appendChild(textNode.div)
    }

    return {
        root: div
    }
}