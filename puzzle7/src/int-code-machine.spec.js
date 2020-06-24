const { Machine } = require('./int-code-machine')


describe('IntCodeMachine', () => {
    let inputs;

    test('Given equal to 8 program position mode should output 1 when input 8', () => {
        const intCodes = [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8]
        const machine = new Machine(intCodes, [8])

        machine.run()

        expect(machine.output).toEqual([1])
    })

    inputs = [[7, 1], [8, 0], [9, 0]]
    for (const [inputValue, expectedOutput] of inputs) {
        test(`Given less than input program using position mode should output ${expectedOutput} when input is ${inputValue}`, () => {
            const intCodes = [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8]
            const machine = new Machine(intCodes, [inputValue])

            machine.run()

            expect(machine.output).toEqual([expectedOutput])
        })
    }

    inputs = [[8, 1], [9, 0]]
    for (const [inputValue, expectedOutput] of inputs) {
        test(`Given equal to input program should output ${expectedOutput} when input is ${inputValue}`, () => {
            const intCodes = [3, 3, 1108, -1, 8, 3, 4, 3, 99]
            const machine = new Machine(intCodes, [inputValue])

            machine.run()

            expect(machine.output).toEqual([expectedOutput])
        })
    }


    inputs = [[7, 1], [8, 0], [9, 0]]
    for (const [inputValue, expectedOutput] of inputs) {
        test(`Given less than input program using immediate mode should output ${expectedOutput} when input is ${inputValue}`, () => {
            const intCodes = [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8]
            const machine = new Machine(intCodes, [inputValue])

            machine.run()

            expect(machine.output).toEqual([expectedOutput])
        })
    }

    inputs = [[1, 1], [0, 0]]
    for (const [inputValue, expectedOutput] of inputs) {
        test(`Given jump program program using position mode should output ${expectedOutput} when input is ${inputValue}`, () => {
            const intCodes = [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9]
            const machine = new Machine(intCodes, [inputValue])

            machine.run()

            expect(machine.output).toEqual([expectedOutput])
        })
    }


    inputs = [[1, 1], [0, 0]]
    for (const [inputValue, expectedOutput] of inputs) {
        test(`Given jump program program using immediate mode should output ${expectedOutput} when input is ${inputValue}`, () => {
            const intCodes = [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1]
            const machine = new Machine(intCodes, [inputValue])

            machine.run()

            expect(machine.output).toEqual([expectedOutput])
        })
    }

    inputs = [[7, 999], [8, 1000], [9, 1001]]
    for (const [inputValue, expectedOutput] of inputs) {
        test(`Given compare program should output ${expectedOutput} when input is ${inputValue}`, () => {
            const intCodes = [
                3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
                1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
                999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99
            ]

            const machine = new Machine(intCodes, [inputValue])

            machine.run()

            expect(machine.output).toEqual([expectedOutput])
        })
    }
})