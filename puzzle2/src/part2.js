const { readFile } = require('mz/fs')
const { runIntCodeProgram } = require('./int-code-machine')

function newNounVerbPair(noun, verb) {
    return { noun, verb }
}

const MIN_NOUN_VERB_VALUE = 0;
const MAX_NOUN_VERB_VALUE = 99;
const NOUN_ADDRESS = 1
const VERB_ADDRESS = 2

function findNounVerbPair(initialMemoryState, expectedOutputValue) {
    for (let nounValue = MIN_NOUN_VERB_VALUE; nounValue <= MAX_NOUN_VERB_VALUE; nounValue++) {
        for (let verbValue = MIN_NOUN_VERB_VALUE; verbValue <= MAX_NOUN_VERB_VALUE; verbValue++) {
            const memory = [...initialMemoryState]
            memory[NOUN_ADDRESS] = nounValue
            memory[VERB_ADDRESS] = verbValue
            runIntCodeProgram(memory)

            if (memory[0] === expectedOutputValue) {
                return newNounVerbPair(nounValue, verbValue)
            }
        }
    }

    throw new Error(`No noun verb pair found`)
}

async function main() {
    const content = await readFile('./input.txt', 'utf8');
    const intCodes = content.split(',').map(x => parseInt(x))

    const nounVerPair = findNounVerbPair(intCodes, 19690720)
    const finalResult = 100 * nounVerPair.noun + nounVerPair.verb

    console.log('value is left at position 0', finalResult)
}

main().catch(e => console.error(e))