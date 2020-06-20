const END_PROGRAM_CODE = 99;
const ADD_VALUE_CODE = 1;
const MULTIPLY_VALUE_CODE = 2;
const INPUT_CODE = 3;
const OUTPUT_CODE = 4;

const INPUT_STREAM = 0;
const OUTPUT_STREAM = 1;


function addAction(machine) {
    const leftInputPosition = machine.getValueFromParameter(0)
    const rightInputPosition = machine.getValueFromParameter(1)
    const outputPosition = machine.getParameterValue(2)

    machine.intCodes[outputPosition] = leftInputPosition + rightInputPosition
}

function multiplyAction(machine) {
    const leftInputPosition = machine.getValueFromParameter(0)
    const rightInputPosition = machine.getValueFromParameter(1)
    const outputPosition = machine.getParameterValue(2)

    machine.intCodes[outputPosition] = leftInputPosition * rightInputPosition
}

function inputAction(machine) {
    const value = machine.streams[INPUT_STREAM].shift()
    const outputPosition = machine.getParameterValue(2)
    machine.intCodes[outputPosition] = value
}

function outputAction(machine) {
    const value = machine.getValueFromParameter(0)
    machine.streams[OUTPUT_STREAM].push(value)
}

function newAction(action, instructionPointerDelta) {
    return { action, instructionPointerDelta }
}

function newInstruction(code, parameters) {
    return { code, parameters }
}

codeAction = new Map([
    [ADD_VALUE_CODE, newAction(addAction, 4)],
    [MULTIPLY_VALUE_CODE, newAction(multiplyAction, 4)],
    [INPUT_CODE, newAction(inputAction, 2)],
    [OUTPUT_CODE, newAction(outputAction, 2)]
])

class Machine {
    constructor(intCodes, inputStream = []) {
        this.intCodes = intCodes
        this.streams = [inputStream, []]
        this.instructionPointer = 0;
        this.currentInstruction = this._decodeInstruction(intCodes[0])
    }

    get currentInstructionCode() {
        return this.currentInstruction.code
    }

    get output() {
        return this.streams[OUTPUT_STREAM]
    }

    getParameterValue(parameterIndex) {
        return this.intCodes[this.instructionPointer + parameterIndex + 1]
    }

    getValueFromParameter(parameterIndex) {
        const POSITION_MODE = 0;
        const parameterValue = this.getParameterValue(parameterIndex)

        if (this.currentInstruction.parameters[parameterIndex] === POSITION_MODE) {
            return this.intCodes[parameterValue]
        }

        return parameterValue
    }

    run() {
        while (this.currentInstructionCode !== END_PROGRAM_CODE) {
            this._executeInstruction()
        }
    }

    _executeInstruction() {
        const action = codeAction.get(this.currentInstruction.code)

        if (action === undefined) {
            throw new Error(`No action for opcode ${this.currentInstruction.code}`)
        }

        action.action(this)
        this.instructionPointer += action.instructionPointerDelta;
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