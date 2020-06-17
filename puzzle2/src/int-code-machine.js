const END_PROGRAM_CODE = 99;
const ADD_VALUE_CODE = 1;
const MULTIPLY_VALUE_CODE = 2;

function addAction(intCodes, currentCodePosition) {
    const leftInputPosition = intCodes[currentCodePosition + 1]
    const rightInputPosition = intCodes[currentCodePosition + 2]
    const outputPosition = intCodes[currentCodePosition + 3]

    intCodes[outputPosition] = intCodes[leftInputPosition] + intCodes[rightInputPosition]
}

function multiplyAction(intCodes, currentCodePosition) {
    const leftInputPosition = intCodes[currentCodePosition + 1]
    const rightInputPosition = intCodes[currentCodePosition + 2]
    const outputPosition = intCodes[currentCodePosition + 3]

    intCodes[outputPosition] = intCodes[leftInputPosition] * intCodes[rightInputPosition]
}


function runIntCodeProgram(intCodes) {
    let currentCodePosition = 0;
    const codeAction = new Map([
        [ADD_VALUE_CODE, addAction],
        [MULTIPLY_VALUE_CODE, multiplyAction]
    ])

    while (intCodes[currentCodePosition] !== END_PROGRAM_CODE) {
        const code = intCodes[currentCodePosition]
        const action = codeAction.get(code)

        if (action === undefined) {
            break;
        }

        action(intCodes, currentCodePosition)
        currentCodePosition += 4;
    }
}

module.exports = { runIntCodeProgram, END_PROGRAM_CODE, ADD_VALUE_CODE, MULTIPLY_VALUE_CODE }