const { readFile } = require('mz/fs')
const { getAsteroidFromGrid, findAsteroidSeingGreatAmountOfAsteroid } = require('./asteriod-monitoring')

async function main() {
    const content = await readFile('./input.txt', 'utf8');
    const asteroidGrid = content.trim().split('\n');
    const asteroidsPositions = getAsteroidFromGrid(asteroidGrid)
    const positionWithGreatestCount = findAsteroidSeingGreatAmountOfAsteroid(asteroidsPositions)
    console.log(positionWithGreatestCount)
}

main().catch(e => console.error(e))


// { asteroid: { x: 19, y: 5 }, count: 344 }