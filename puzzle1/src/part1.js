const { readFile } = require('mz/fs')

function calculateFuel(moduleMass) {
    return Math.floor(moduleMass / 3) - 2
}

async function main() {
    const content = await readFile('./input.txt', 'utf8');
    const moduleMasses = content.split('\n').filter(x => x !== '').map(x => parseInt(x))
    let totalFuelAmount = 0;

    for (const moduleMass of moduleMasses) {
        totalFuelAmount += calculateFuel(moduleMass)
    }


    console.log(totalFuelAmount)
}

main().catch(e => console.error(e))