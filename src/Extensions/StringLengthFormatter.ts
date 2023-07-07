export function StringLengthFormatter(stringLength: number): string {
    const oneMil = 1_000_000
    const oneThousand = 1_000
    const fix = 2
    
    const length = stringLength

    if (length > oneMil) {
        const value = length / oneMil

        return `${value.toFixed(fix).toString()}M`
    } else if (length > oneThousand) {
        const value = length / oneThousand

        return `${value.toFixed(fix).toString()}K`
    } else {
        return length.toString()
    }
}