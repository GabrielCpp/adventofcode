const { Machine } = require('./int-code-machine')


describe('IntCodeMachine', () => {
    let inputs;

    test('Given equal to 8 program position mode should output 1 when input 8', () => {
        const intCodes = [3n, 9n, 8n, 9n, 10n, 9n, 4n, 9n, 99n, -1n, 8n]
        const machine = new Machine(intCodes, [8n])

        machine.run()

        expect(machine.output).toEqual([1n])
    })

    inputs = [[7n, 1n], [8n, 0n], [9n, 0n]]
    for (const [inputValue, expectedOutput] of inputs) {
        test(`Given less than input program using position mode should output ${expectedOutput} when input is ${inputValue}`, () => {
            const intCodes = [3n, 9n, 7n, 9n, 10n, 9n, 4n, 9n, 99n, -1n, 8n]
            const machine = new Machine(intCodes, [inputValue])

            machine.run()

            expect(machine.output).toEqual([expectedOutput])
        })
    }

    inputs = [[8n, 1n], [9n, 0n]]
    for (const [inputValue, expectedOutput] of inputs) {
        test(`Given equal to input program should output ${expectedOutput} when input is ${inputValue}`, () => {
            const intCodes = [3n, 3n, 1108n, -1n, 8n, 3n, 4n, 3n, 99n]
            const machine = new Machine(intCodes, [inputValue])

            machine.run()

            expect(machine.output).toEqual([expectedOutput])
        })
    }


    inputs = [[7n, 1n], [8n, 0n], [9n, 0n]]
    for (const [inputValue, expectedOutput] of inputs) {
        test(`Given less than input program using immediate mode should output ${expectedOutput} when input is ${inputValue}`, () => {
            const intCodes = [3n, 9n, 7n, 9n, 10n, 9n, 4n, 9n, 99n, -1n, 8n]
            const machine = new Machine(intCodes, [inputValue])

            machine.run()

            expect(machine.output).toEqual([expectedOutput])
        })
    }

    inputs = [[1n, 1n], [0n, 0n]]
    for (const [inputValue, expectedOutput] of inputs) {
        test(`Given jump program program using position mode should output ${expectedOutput} when input is ${inputValue}`, () => {
            const intCodes = [3n, 12n, 6n, 12n, 15n, 1n, 13n, 14n, 13n, 4n, 13n, 99n, -1n, 0n, 1n, 9n]
            const machine = new Machine(intCodes, [inputValue])

            machine.run()

            expect(machine.output).toEqual([expectedOutput])
        })
    }


    inputs = [[1n, 1n], [0n, 0n]]
    for (const [inputValue, expectedOutput] of inputs) {
        test(`Given jump program program using immediate mode should output ${expectedOutput} when input is ${inputValue}`, () => {
            const intCodes = [3n, 3n, 1105n, -1n, 9n, 1101n, 0n, 0n, 12n, 4n, 12n, 99n, 1n]
            const machine = new Machine(intCodes, [inputValue])

            machine.run()

            expect(machine.output).toEqual([expectedOutput])
        })
    }

    inputs = [[7n, 999n], [8n, 1000n], [9n, 1001n]]
    for (const [inputValue, expectedOutput] of inputs) {
        test(`Given compare program should output ${expectedOutput} when input is ${inputValue}`, () => {
            const intCodes = [
                3n, 21n, 1008n, 21n, 8n, 20n, 1005n, 20n, 22n, 107n, 8n, 21n, 20n, 1006n, 20n, 31n,
                1106n, 0n, 36n, 98n, 0n, 0n, 1002n, 21n, 125n, 20n, 4n, 20n, 1105n, 1n, 46n, 104n,
                999n, 1105n, 1n, 46n, 1101n, 1000n, 1n, 20n, 4n, 20n, 1105n, 1n, 46n, 98n, 99
            ]

            const machine = new Machine(intCodes, [inputValue])

            machine.run()

            expect(machine.output).toEqual([expectedOutput])
        })
    }

    test('Given relative base should relation parameter add parameter value to relative base', () => {
        const expectedOutput = [12n].map(x => BigInt(x));
        const program = [109n, 10n, 21101n, 4n, 8n, 1n, 4n, 11n, 99n];
        const machine = new Machine(program, [], true);

        machine.run();
        const actualOutput = machine.output;

        expect(actualOutput).toEqual(expectedOutput)
    })

    test('Given adjust relative base should add parameter to last relative base value', () => {
        const expectedRelativeBase = BigInt(6);
        const program = [109n, 10n, 109n, -4n, 99n];
        const machine = new Machine(program);

        machine.run();

        expect(machine.relativeBase).toEqual(expectedRelativeBase)
    })

    test('Given program should produce a copy of itself', () => {
        const expectedOutput = [109n, 1n, 204n, -1n, 1001n, 100n, 1n, 100n, 1008n, 100n, 16n, 101n, 1006n, 101n, 0n, 99n];
        const program = [109n, 1n, 204n, -1n, 1001n, 100n, 1n, 100n, 1008n, 100n, 16n, 101n, 1006n, 101n, 0n, 99n];
        const machine = new Machine(program);

        machine.run();

        expect(machine.output).toEqual(expectedOutput)
    })

    test('Given large number multiplier program should give 16 digit number', () => {
        const expectedOutput = [34915192n * 34915192n];
        const program = [1102n, 34915192n, 34915192n, 7n, 4n, 7n, 99n, 0n];
        const machine = new Machine(program);

        machine.run();

        expect(machine.output).toEqual(expectedOutput)
    })
})