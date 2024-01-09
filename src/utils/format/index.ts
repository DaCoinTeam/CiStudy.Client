import { Address } from "web3"

const sanitizeNumericInput = (input: string): string | null => {
    const regex = /^[0-9]*[.,]?[0-9]*$/
    if (!regex.test(input)) {
        return null
    }
    const sanitizedValue = input.replace(/,/g, ".")
    return sanitizedValue
}

const shortenAddress = (account: Address) =>
    `${account.slice(0, 4)}...${account.slice(-2)}`

const parseStringToNumber = (string: string, defaultValue?: number): number => {
    const parseValue = Number.parseFloat(string)
    if (Number.isNaN(parseValue) || !Number.isFinite(parseValue)) {
        return defaultValue ?? 0
    }
    return parseValue
}

const parseNumberToString = (number: number): string =>
    number !== 0 ? number.toString() : ""

const parseStringToNumberMultiply = (
    string: string,
    multiply: number,
    defaultValue?: number
): string => {
    let parsedNumber = parseStringToNumber(string, defaultValue)
    parsedNumber *= multiply
    return parseNumberToString(parsedNumber)
}

export enum FieldSelectionMode {
  Include,
  Skip,
}

const createPayloadString = <T>(
    keys: T[],
    fields: T[] = [],
    mode: FieldSelectionMode = FieldSelectionMode.Skip
): string => {
    let selected: T[] = []
    switch (mode) {
    case FieldSelectionMode.Include:
        for (const field of fields) {
            if (!selected.includes(field) && keys.includes(field)) {
                selected.push(field)
            }
        }
        break
    case FieldSelectionMode.Skip:
        selected = keys
        for (const field of fields) {
            if (selected.includes(field)) {
                const indexToRemove = selected.indexOf(field)
                selected.slice(indexToRemove, 1)
            }
        }
        break
    }
    return selected.join(", ")
}

const createTokenizedPayloadString = <T>(
    keys: T[],
    fields: T[] = [],
    mode: FieldSelectionMode = FieldSelectionMode.Skip
) => {
    const data = createPayloadString(keys, fields, mode)
    return `data { ${data} } tokens { accessToken, refreshToken }`
}

const format = {
    sanitizeNumericInput,
    shortenAddress,
    parseStringToNumber,
    parseNumberToString,
    parseStringToNumberMultiply,
    createPayloadString,
    createTokenizedPayloadString,
}

export default format
