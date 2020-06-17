const { readFile } = require('mz/fs')

function calculateFuel(moduleMass) {
    let totalFuel = 0;
    let remainingMass = moduleMass;

    while (remainingMass > 6) {
        let currentFuelMass = Math.floor(remainingMass / 3) - 2
        remainingMass = currentFuelMass
        totalFuel += currentFuelMass
    }

    return totalFuel
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