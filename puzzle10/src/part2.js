const { readFile } = require('mz/fs')
const { getAsteroidFromGrid, buildAsteroidMap } = require('./asteriod-monitoring')
const { getVaporizedAsteroidsForOneRotation } = require('./laser-beam')

async function main() {
    const content = await readFile('./input.txt', 'utf8');
    const asteroidGrid = content.trim().split('\n');
    const asteroidsPositions = getAsteroidFromGrid(asteroidGrid)
    const asteroidMap = buildAsteroidMap(asteroidsPositions);
    const actualVaporizedAsteroids = getVaporizedAsteroidsForOneRotation(asteroidMap, { x: 30, y: 34 }, 300)
    const vectorPosition200 = actualVaporizedAsteroids.vaporizedAsteroids[199]
    console.log(vectorPosition200.x * 100 + vectorPosition200.y)
    // 2732
}

main().catch(e => console.error(e))
