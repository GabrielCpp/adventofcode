const { runIntCodeProgram, END_PROGRAM_CODE, ADD_VALUE_CODE, MULTIPLY_VALUE_CODE } = require('./int-code-machine')

describe('IntCodeMachine', () => {
    test('Given adition should store result', () => {
        const expectedResult = 5
        const expectedResultPosition = 7
        const intCodes = [ADD_VALUE_CODE, 5, 6, 7, END_PROGRAM_CODE, 2, 3, 0]

        runIntCodeProgram(intCodes)

        expect(intCodes[expectedResultPosition]).toBe(expectedResult)
    })

    test('Given multiply should store result', () => {
        const expectedResult = 6
        const expectedResultPosition = 7
        const intCodes = [MULTIPLY_VALUE_CODE, 5, 6, 7, END_PROGRAM_CODE, 2, 3, 0]

        runIntCodeProgram(intCodes)

        expect(intCodes[expectedResultPosition]).toBe(expectedResult)
    })
})