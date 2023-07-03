import './StylishTextInput.css'

export interface IStylishTextInput {
    value(): string
    readonly root: HTMLInputElement
}

export function StylishTextInput(): IStylishTextInput {
    const input = document.createElement('input')
    input.className = 'stylishTextInput'

    const possiblePlaceholders = [ 'Suicidal', 'Ate chocolate', 'Played Dark Souls', 'Drank' ]
    const placeholder = possiblePlaceholders[Math.floor(Math.random() * possiblePlaceholders.length)];
    input.placeholder = placeholder

    return {
        value: function() {
            return input.value
        },
        root: input
    }
}