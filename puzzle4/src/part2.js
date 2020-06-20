const { head, tail } = require('lodash')

function hasIncreasingDigits(numberAsString) {
    const digits = [...numberAsString]
    let lastDigit = head(digits)

    for (const digit of tail(digits)) {
        if (digit < lastDigit) {
            return false
        }

        lastDigit = digit;
    }

    return true
}

function hasDoubleDigit(numberAsString) {
    const digits = [...numberAsString]
    let lastDigit = head(digits)

    for (const digit of tail(digits)) {
        if (digit === lastDigit) {
            return true
        }

        lastDigit = digit;
    }

    return false
}

function atLeastOneDigitGroupIsNotPartOfALargerGroup(numberAsString) {
    const digits = [...numberAsString]
    let lastDigit = head(digits)
    let adjacentCounts = Array.from({ length: 10 }, () => 0)

    for (const digit of tail(digits)) {
        if (digit === lastDigit) {
            adjacentCounts[digit]++
        }

        lastDigit = digit;
    }

    return adjacentCounts.some(count => count == 1)
}

function countPermutations(min, max) {
    let nbPermutations = 0

    for (let currentNumber = min; currentNumber < max; ++currentNumber) {
        const numberAsString = String(currentNumber)

        if (!hasIncreasingDigits(numberAsString)) {
            continue
        }

        if (!hasDoubleDigit(numberAsString)) {
            continue
        }

        if (!atLeastOneDigitGroupIsNotPartOfALargerGroup(numberAsString)) {
            continue
        }

        ++nbPermutations
    }

    return nbPermutations
}

const nbPermutation = countPermutations(272091, 815432)
console.log(`Different passwords count: ${nbPermutation}`)
