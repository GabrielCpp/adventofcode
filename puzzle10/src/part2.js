const { readFile } = require('mz/fs')
const { getAsteroidFromGrid } = require('./asteriod-monitoring')

async function main() {
    const content = await readFile('./input.txt', 'utf8');
    const asteroidGrid = content.trim().split('\n');
    const asteroidsPositions = getAsteroidFromGrid(asteroidGrid)

}

main().catch(e => console.error(e))
