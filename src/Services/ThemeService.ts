export type ThemeChangeListener = (styling: Styling) => void

export interface IThemeService {
    getCurrentStyling(): Styling
    updateTheme(): void
    addChangeListener(listener: ThemeChangeListener): void
    rmChangeListener(listener: ThemeChangeListener): void
}

const localStorageThemeStorageKey = 'themeIndex'

export type BackgroundColor = string
export type ForegroundColor = string
export type SelectedTileColor = string
export type Styling = [BackgroundColor, ForegroundColor, SelectedTileColor]

// Thanks to https://www.w3schools.com/colors/ for the colors
const themes: Styling[] = [
    [
        "FFD662",
        "000000",
        'DDB440'
    ],
    [
        "00539C",
        "FFFFFF",
        '00317A'
    ],
    [
        "F7CAC9",
        "000000",
        'D5A8A7'
    ],
    [
        "00758F",
        "FFFFFF",
        '00536D'
    ],
    [
        "56C6A9",
        "000000",
        '34A487'
    ],
    [
        "FFA500",
        "FFFFFF",
        'DD8300'
    ],
    [
        "CD212A",
        "000000",
        'AB0008'
    ],
    [
        "E8B5CE",
        "000000",
        'C693AC'
    ],
    [
        "F0EAD6",
        "000000",
        'D0C8B4'
    ]
]

function addingPound(str: string): string {
    return `#${str}`
}

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
        const theme = themes[currentThemeIndex]

        const stylingWithPoundAdded: Styling = [
            addingPound(theme[0]),
            addingPound(theme[1]),
            addingPound(theme[2]),
        ]

        return stylingWithPoundAdded
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
        addChangeListener,
        rmChangeListener(removedListener) {
            listeners = listeners.filter((listener) => listener !== removedListener)
        },
    }
}