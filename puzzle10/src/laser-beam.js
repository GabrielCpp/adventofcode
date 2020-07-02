const { newVector, makeVectorId, isVectorEqual, computeLinearRegressionForX, newLinearRegression } = require('./vector')
const { getDiscreteVectorsBetweenAsteroids, buildAsteroidMap } = require('./asteriod-monitoring')

const radianFor1Deg = 1 / 360 * Math.PI

function* getBeamDirections(asteroidPositions, beamPosition) {
    let laserBeanAngle = Math.PI / 2
    let endAngle = 0
    let maxX = asteroidPositions.map(vector => vector.x + 1).reduce((previous, current) => Math.max(previous, current), 0);
    let maxY = asteroidPositions.map(vector => vector.y + 1).reduce((previous, current) => Math.max(previous, current), 0);

    for (; laserBeanAngle >= endAngle; laserBeanAngle -= radianFor1Deg) {
        const targetX = Math.cos(laserBeanAngle) * maxX + beamPosition.x;
        const targetY = beamPosition.y - Math.sin(laserBeanAngle) * beamPosition.y;
        const targetVector = newVector(targetX, targetY)
        console.log(beamPosition, targetVector)
        const vectors = getDiscreteVectorsBetweenAsteroids(beamPosition, targetVector)
        yield vectors
    }

    laserBeanAngle = Math.PI * 2
    endAngle = Math.PI / 2

    for (; laserBeanAngle > endAngle; laserBeanAngle -= radianFor1Deg) {
        const targetX = Math.cos(laserBeanAngle) * maxX;
        const targetY = Math.sin(laserBeanAngle) * maxY;
        const targetVector = newVector(targetX, targetY)
        const vectors = getDiscreteVectorsBetweenAsteroids(beamPosition, targetVector)
        yield vectors
    }
}

function getVaporizedAsteroidsForOneRotation(asteroidVectors, beamPosition, asteroidMap = undefined) {
    asteroidMap = asteroidMap || buildAsteroidMap(asteroidVectors)
    const vaporizedAsteroids = []

    for (const vectors of getBeamDirections(asteroidVectors, beamPosition)) {
        const ateroidVaporized = vectors.find(vector => asteroidMap.has(makeVectorId(vector)))

        if (ateroidVaporized !== undefined) {
            vaporizedAsteroids.push(ateroidVaporized)
            asteroidMap.delete(makeVectorId(ateroidVaporized))
        }
    }

    return vaporizedAsteroids
}

module.exports = { getBeamDirections, getVaporizedAsteroidsForOneRotation }