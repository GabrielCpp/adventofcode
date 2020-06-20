const { readFile } = require('mz/fs')
const { Machine } = require('./int-code-machine')

async function main() {
    const content = await readFile('./input.txt', 'utf8');
    const intCodes = content.split(',').map(x => parseInt(x))

    const machine = new Machine(intCodes, [5]);
    machine.run()
    console.log('Machine output', machine.output)
}

main().catch(e => console.error(e))