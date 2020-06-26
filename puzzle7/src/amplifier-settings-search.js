const { Machine } = require('./int-code-machine')
const assert = require('assert')
const { last } = require('lodash')

function* generateCombinaisons(items, pickedSequence = []) {
    if (items.length === 1) {
        yield [...pickedSequence, items[0]]
    }
    else {
        let indexNumber = 0;
        for (const item of items) {
            const itemFirstSlice = items.slice(0, indexNumber)
            const itemSecondSlice = items.slice(indexNumber + 1)
            const newItems = [...itemFirstSlice, ...itemSecondSlice]
            const newSequence = [...pickedSequence, item]

            yield* generateCombinaisons((newItems), newSequence)
            indexNumber++;
        }
    }
}

function findAmplifierSettingsMaximisingOutput(intCodes, possibleSettings = [0, 1, 2, 3, 4]) {
    let bestSettings = { outputValue: 0, settings: [] }

    for (const settings of generateCombinaisons(possibleSettings)) {
        let lastAmplifierOutput = 0;

        for (let iAmplifier = 0; iAmplifier < possibleSettings.length; iAmplifier++) {
            const inputs = [settings[iAmplifier], lastAmplifierOutput]
            const machine = new Machine([...intCodes], inputs)

            machine.run()
            lastAmplifierOutput = machine.output[0]
        }

        if (lastAmplifierOutput > bestSettings.outputValue) {
            bestSettings = { outputValue: lastAmplifierOutput, settings }
        }
    }

    return bestSettings
}

function runFeedbackAmplierMachines(machines) {
    const generators = machines.map(machine => {
        const iterator = machine.runWithIncompleteInput()
        const lastResult = iterator.next()
        return { iterator, lastResult }
    })

    let currentGeneratorIndex = 0;
    let lastAmplifierOutput = 0;

    while (!last(generators).lastResult.done) {
        const { lastResult, iterator } = generators[currentGeneratorIndex]
        debugger

        if (lastResult.value.action === 'require_input') {
            assert(lastAmplifierOutput !== undefined)
            generators[currentGeneratorIndex].lastResult = iterator.next(lastAmplifierOutput)
            lastAmplifierOutput = undefined
        }
        else if (lastResult.value.action === 'output_value') {
            assert(lastAmplifierOutput === undefined)
            lastAmplifierOutput = lastResult.value.value
            generators[currentGeneratorIndex].lastResult = iterator.next()

            if (currentGeneratorIndex + 1 >= generators.length) {
                currentGeneratorIndex = 0
            }
            else {
                currentGeneratorIndex++
            }
        }
    }

    return lastAmplifierOutput
}

function findAmplifierFeedbackSettingsMaximisingOutput(intCodes, possibleSettings = [5, 6, 7, 8, 9]) {
    function* requestInput(machine) {
        if (machine.input.length === 0) {
            const value = yield { action: 'require_input' }
            machine.input.push(value)
        }
    }

    function* publishOutput(machine) {
        yield { action: 'output_value', value: machine.output.shift() }
    }

    let bestSettings = { outputValue: 0, settings: [] }

    for (const settings of generateCombinaisons(possibleSettings)) {
        let machines = []

        for (let iAmplifier = 0; iAmplifier < possibleSettings.length; iAmplifier++) {
            const machine = new Machine([...intCodes], [settings[iAmplifier]])
            machine.onInputValue = requestInput;
            machine.onOutputValue = publishOutput;
            machines.push(machine)
        }

        const lastAmplifierOutput = runFeedbackAmplierMachines(machines)

        if (lastAmplifierOutput > bestSettings.outputValue) {
            bestSettings = { outputValue: lastAmplifierOutput, settings }
        }
    }

    return bestSettings
}

module.exports = { findAmplifierSettingsMaximisingOutput, findAmplifierFeedbackSettingsMaximisingOutput }