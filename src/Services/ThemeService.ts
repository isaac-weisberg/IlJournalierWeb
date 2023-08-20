export type ThemeChangeListener = (styling: Styling) => void

export interface IThemeService {
    getCurrentStyling(): Styling
    updateTheme(): void
    addChangeListener(listener: ThemeChangeListener): void
}

const localStorageThemeStorageKey = 'themeIndex'

export type BackgroundColor = string
export type ForegroundColor = string
export type SelectedTileColor = string
export type Styling = [BackgroundColor, ForegroundColor, SelectedTileColor]

// Thanks to https://www.w3schools.com/colors/ for the colors
const themes: Styling[] = [
    [
        "#FFD662",
        "#000000",
        '#D3BD2B'
    ],
    [
        "#00539C",
        "#FFFFFF",
        '#141723'
    ],
    [
        "#F7CAC9",
        "#000000",
        '#7995B2'
    ],
    [
        "#00758F",
        "#FFFFFF",
        '#005093'
    ],
    [
        "#56C6A9",
        "#000000",
        '#80B887'
    ],
    [
        "#FFA500",
        "#FFFFFF",
        '#717375'
    ],
    [
        "#CD212A",
        "#000000",
        '#80B887'
    ],
    [
        "#E8B5CE",
        "#000000",
        '#80B887'
    ],
    [
        "#F0EAD6",
        "#000000",
        '#80B887'
    ]
]


function nextThemeIndexAfter(index: number): number {
    if (index == themes.length - 1) {
        return 0
    }
    return index + 1
}

function readLocalStorage(): number|undefined {
    const currentLocalStorageValue = localStorage.getItem(localStorageThemeStorageKey)

    if (currentLocalStorageValue) {
        const int = parseInt(currentLocalStorageValue, 10)

        if (!isNaN(int)) {
            return int
        }
    } 
    return undefined
}

function saveLocalStorage(themeIndex: number) {
    localStorage.setItem(localStorageThemeStorageKey, themeIndex.toString())
}

export function ThemeService(): IThemeService {
    let currentThemeIndex: number = readLocalStorage() || 2
    let listeners: ThemeChangeListener[] = []

    function getCurrentStyling(): Styling {
        return themes[currentThemeIndex]
    }

    function updateTheme() {
        const newIndex = nextThemeIndexAfter(currentThemeIndex)

        currentThemeIndex = newIndex
        saveLocalStorage(newIndex)

        const styling = getCurrentStyling()

        listeners.forEach(listener => listener(styling))
    }

    function addChangeListener(listener: ThemeChangeListener) {
        listeners.push(listener)
    }

    return {
        getCurrentStyling,
        updateTheme,
        addChangeListener
    }
}