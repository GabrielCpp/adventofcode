const { noop } = require('lodash')
const assert = require('assert')

const END_PROGRAM_CODE = 99;
const ADD_VALUE_CODE = 1;
const MULTIPLY_VALUE_CODE = 2;
const INPUT_CODE = 3;
const OUTPUT_CODE = 4;
const JUMP_IF_TRUE_CODE = 5;
const JUMP_IF_FALSE_CODE = 6;
const LESS_THAN_CODE = 7;
const EQUAL_TO_CODE = 8;
const ADJUST_RELATIVE_BASE_CODE = 9;

const INPUT_STREAM = 0;
const OUTPUT_STREAM = 1;

const POSITION_MODE = 0;
const IMMEDIATE_MODE = 1;
const RELATIVE_MODE = 2;


function addAction(machine) {
    const leftValue = machine.getInputParameter(0)
    const rightValue = machine.getInputParameter(1)
    const outputPosition = machine.getOutputParameter(2)

    assert(typeof leftValue == 'bigint')
    assert(typeof rightValue == 'bigint')
    assert(typeof outputPosition == 'bigint')

    machine.intCodes[outputPosition] = leftValue + rightValue

    assert(typeof machine.intCodes[outputPosition] == 'bigint')
}

function multiplyAction(machine) {
    const leftValue = machine.getInputParameter(0)
    const rightValue = machine.getInputParameter(1)
    const outputPosition = machine.getOutputParameter(2)

    assert(typeof leftValue == 'bigint')
    assert(typeof rightValue == 'bigint')
    assert(typeof outputPosition == 'bigint')

    machine.intCodes[outputPosition] = leftValue * rightValue
}

function inputAction(machine) {
    const inputStream = machine.input
    const value = inputStream.shift();
    const outputPosition = machine.getOutputParameter(0)

    assert(typeof value == 'bigint')
    assert(typeof outputPosition == 'bigint')

    machine.intCodes[outputPosition] = value
}

function outputAction(machine) {
    const value = machine.getInputParameter(0)
    assert(typeof value == 'bigint')

    machine.output.push(value)
}

function jumpIfTrue(machine) {
    const value = machine.getInputParameter(0)
    const newInstructionPointer = machine.getInputParameter(1)

    assert(typeof value == 'bigint')
    assert(typeof newInstructionPointer == 'bigint')

    if (value !== 0n) {
        return newInstructionPointer
    }
}

function jumpIfFalse(machine) {
    const value = machine.getInputParameter(0)
    const newInstructionPointer = machine.getInputParameter(1)

    assert(typeof value == 'bigint')
    assert(typeof newInstructionPointer == 'bigint')

    if (value === 0n) {
        return newInstructionPointer
    }
}

function lessThan(machine) {
    const leftValue = machine.getInputParameter(0)
    const rightValue = machine.getInputParameter(1)
    const outputPosition = machine.getOutputParameter(2)

    assert(typeof leftValue == 'bigint')
    assert(typeof rightValue == 'bigint')
    assert(typeof outputPosition == 'bigint')

    machine.intCodes[outputPosition] = leftValue < rightValue ? 1n : 0n
}

function equalTo(machine) {
    const leftValue = machine.getInputParameter(0)
    const rightValue = machine.getInputParameter(1)
    const outputPosition = machine.getOutputParameter(2)

    assert(typeof leftValue == 'bigint')
    assert(typeof rightValue == 'bigint')
    assert(typeof outputPosition == 'bigint')

    machine.intCodes[outputPosition] = leftValue === rightValue ? 1n : 0n
}

function adjustRelativeBase(machine) {
    assert(typeof machine.relativeBase == 'bigint')

    const relativeBase = machine.getInputParameter(0)
    assert(typeof relativeBase == 'bigint')

    machine.relativeBase += relativeBase
}

function newAction(action, instructionPointerDelta, preAction, postAction) {
    return { action, instructionPointerDelta, preAction, postAction }
}

function newInstruction(code, parameters) {
    return { code, parameters }
}

function* beforeInput(machine) { yield* machine.onInputValue(machine) }

function* afterOutput(machine) {
    yield* machine.onOutputValue(machine)
}

const codeAction = new Map([
    [ADD_VALUE_CODE, newAction(addAction, 4)],
    [MULTIPLY_VALUE_CODE, newAction(multiplyAction, 4)],
    [INPUT_CODE, newAction(inputAction, 2, beforeInput)],
    [OUTPUT_CODE, newAction(outputAction, 2, undefined, afterOutput)],
    [JUMP_IF_TRUE_CODE, newAction(jumpIfTrue, 3)],
    [JUMP_IF_FALSE_CODE, newAction(jumpIfFalse, 3)],
    [LESS_THAN_CODE, newAction(lessThan, 4)],
    [EQUAL_TO_CODE, newAction(equalTo, 4)],
    [ADJUST_RELATIVE_BASE_CODE, newAction(adjustRelativeBase, 2)]
])

class Machine {
    constructor(intCodes, inputStream = []) {
        this.intCodes = intCodes
        this.streams = [inputStream, []]
        this.relativeBase = 0n
        this.instructionPointer = 0;
        this.currentInstruction = this._decodeInstruction(this.intCodes[0])
        this.onInputValue = function* () { }
        this.onOutputValue = function* () { }
    }

    get currentInstructionCode() {
        return this.currentInstruction.code
    }

    get output() {
        return this.streams[OUTPUT_STREAM]
    }

    get input() {
        return this.streams[INPUT_STREAM]
    }

    getParameterValue(parameterIndex) {
        return this.intCodes[this.instructionPointer + parameterIndex + 1]
    }

    getOutputParameter(parameterIndex) {
        const parameterValue = this.getParameterValue(parameterIndex)
        const mode = this.currentInstruction.parameters[parameterIndex]

        if (mode === RELATIVE_MODE) {
            return this.relativeBase + parameterValue
        }
        else if (mode === POSITION_MODE) {
            return parameterValue
        }

        throw new Error(`Unkown output parameter mode ${mode}`)
    }

    getInputParameter(parameterIndex) {
        const parameterValue = this.getParameterValue(parameterIndex)
        const mode = this.currentInstruction.parameters[parameterIndex]

        if (mode === POSITION_MODE) {
            return this.intCodes[parameterValue] || 0n
        }
        else if (mode === RELATIVE_MODE) {
            return this.intCodes[this.relativeBase + parameterValue] || 0n
        }
        else if (mode === IMMEDIATE_MODE) {
            return parameterValue
        }

        throw new Error(`Unkown input parameter mode ${typeof mode} ${mode}`)
    }

    run() {
        while (this.currentInstructionCode !== END_PROGRAM_CODE) {
            const it = this._executeInstruction()
            let result = it.next();

            while (!result.done) {
                result = it.next();
            }
        }
    }

    *runWithIncompleteInput() {
        while (this.currentInstructionCode !== END_PROGRAM_CODE) {
            yield* this._executeInstruction()
        }
    }

    *_executeInstruction() {
        const action = codeAction.get(this.currentInstruction.code)

        if (action === undefined) {
            throw new Error(`No action for opcode ${this.currentInstruction.code}`)
        }

        if (action.preAction !== undefined) {
            yield* action.preAction(this)
        }

        const newInstructionPointer = action.action(this)

        if (action.postAction !== undefined) {
            yield* action.postAction(this)
        }

        if (newInstructionPointer === undefined) {
            this.instructionPointer += action.instructionPointerDelta;
        }
        else {
            this.instructionPointer = Number(newInstructionPointer)
        }

        this.currentInstruction = this._decodeInstruction(this.intCodes[this.instructionPointer])
    }

    _decodeInstruction(value) {
        const INSTRUCTION_LENGTH = 5
        const paddedValue = String(value).padStart(INSTRUCTION_LENGTH, '0')
        const code = parseInt(paddedValue.substring(3))
        const p1 = parseInt(paddedValue[2])
        const p2 = parseInt(paddedValue[1])
        const p3 = parseInt(paddedValue[0])

        return newInstruction(code, [p1, p2, p3])
    }
}


module.exports = { Machine, END_PROGRAM_CODE, ADD_VALUE_CODE, MULTIPLY_VALUE_CODE }