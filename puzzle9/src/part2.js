const { readFile } = require('mz/fs')
const { Machine } = require('./int-code-machine')

function convertImageToString(image) {
    return image.map(row => row.map(digit => digit === 0 ? ' ' : 'X').join('')).join('\n')
}

async function main() {
    const content = await readFile('./input.txt', 'utf8');
    const program = content.trim().split(',').map(x => BigInt(x))
    const machine = new Machine(program, [2n])

    try {

        machine.run()

        console.log(`Output:`, machine.output)
    }
    catch (e) {
        console.log(e)
        console.log(machine.currentInstruction)
    }
}

main().catch(e => console.error(e))