const { readFile } = require('mz/fs')
const { getAsteroidFromGrid, findAsteroidSeingGreatAmountOfAsteroid } = require('./asteriod-monitoring')

async function main() {
    const content = await readFile('./input.txt', 'utf8');
    const asteroidGrid = content.trim().split('\n');
    const asteroidsPositions = getAsteroidFromGrid(asteroidGrid)
    const positionWithGreatestCount = findAsteroidSeingGreatAmountOfAsteroid(asteroidsPositions)

    // { asteroid: { x: 30, y: 34 }, count: 344 }
    console.log(positionWithGreatestCount)
}

main().catch(e => console.error(e))
