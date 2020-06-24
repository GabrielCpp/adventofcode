const { Machine } = require('./int-code-machine')

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

module.exports = { findAmplifierSettingsMaximisingOutput }