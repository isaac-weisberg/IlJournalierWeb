import './StylishTextInput.css'

export interface IStylishTextInput {
    value(): string
    reset(): void
    readonly root: HTMLInputElement
}

export function StylishTextInput(): IStylishTextInput {
    const input = document.createElement('input')
    input.className = 'stylishTextInput'

    const possiblePlaceholders = [ 
        'Suicidal', 
        'Ate chocolate', 
        'Played Dark Souls', 
        'Drank',
        'Ел fromage',
        'Занимался дрифтингом',
        'Занимался фистингом',
        'Omelette du fromage',
        'Beatles - You never give me your money',
        'Ju bli\'e mo cha\'e'
    ]
    const placeholder = possiblePlaceholders[Math.floor(Math.random() * possiblePlaceholders.length)];
    input.placeholder = placeholder

    return {
        value() {
            return input.value
        },
        reset() {
            input.value = ''
        },
        root: input
    }
}