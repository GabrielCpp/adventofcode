const { readFile } = require('mz/fs')
const { runIntCodeProgram } = require('./int-code-machine')

async function main() {
    const content = await readFile('./input.txt', 'utf8');
    const intCodes = content.split(',').map(x => parseInt(x))

    intCodes[1] = 12
    intCodes[2] = 2
    runIntCodeProgram(intCodes)
    console.log('value is left at position 0', intCodes[0])
}

main().catch(e => console.error(e))