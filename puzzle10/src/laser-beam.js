const { newVector, makeVectorId, isVectorEqual, computeLinearRegressionForX, newLinearRegression, isFloatEqual, roundVector, round4 } = require('./vector')
const { getDiscreteVectorsBetweenAsteroids } = require('./asteriod-monitoring')

const radianFor1Deg = 0.01 / 360 * Math.PI

function distancePow2(vector1, vector2) {
    return (vector1.x - vector2.x) * (vector1.x - vector2.x) + (vector1.y - vector2.y) * (vector1.y - vector2.y);
}

function buildPositionCompare(position) {
    return (v1, v2) => {
        const d1 = distancePow2(v1, position)
        const d2 = distancePow2(v2, position)
        return d1 - d2;
    }
}

function* getBeamDirections(beamPosition, radius) {
    let targetX, targetY, targetVector, vectors, laserBeanAngle, endAngle;
    const sortClosestToBeamFirst = buildPositionCompare(beamPosition)
    let stepSize = 1

    laserBeanAngle = Math.PI / 2
    endAngle = 0

    for (; laserBeanAngle >= endAngle; laserBeanAngle -= radianFor1Deg) {
        targetX = beamPosition.x + Math.cos(laserBeanAngle) * radius;
        targetY = beamPosition.y - Math.sin(laserBeanAngle) * radius;
        targetVector = newVector(targetX, targetY)
        vectors = getDiscreteVectorsBetweenAsteroids(beamPosition, targetVector, true, stepSize).map(vector => roundVector(vector))
        vectors.sort(sortClosestToBeamFirst)

        yield vectors
    }

    laserBeanAngle = 2 * Math.PI
    endAngle = 3 * Math.PI / 2

    for (; laserBeanAngle >= endAngle; laserBeanAngle -= radianFor1Deg) {
        targetX = beamPosition.x + Math.cos(laserBeanAngle) * radius;
        targetY = beamPosition.y - Math.sin(laserBeanAngle) * radius;
        targetVector = newVector(targetX, targetY)
        vectors = getDiscreteVectorsBetweenAsteroids(beamPosition, targetVector, true, stepSize).map(vector => roundVector(vector))
        vectors.sort(sortClosestToBeamFirst)

        yield vectors
    }

    laserBeanAngle = 3 * Math.PI / 2
    endAngle = Math.PI

    for (; laserBeanAngle >= endAngle; laserBeanAngle -= radianFor1Deg) {
        targetX = Math.floor(beamPosition.x + Math.cos(laserBeanAngle) * radius);
        targetY = beamPosition.y - Math.sin(laserBeanAngle) * radius;
        targetVector = newVector(targetX, targetY)
        vectors = getDiscreteVectorsBetweenAsteroids(beamPosition, targetVector, true, stepSize).map(vector => roundVector(vector))
        vectors.sort(sortClosestToBeamFirst)

        yield vectors
    }

    laserBeanAngle = Math.PI
    endAngle = Math.PI / 2

    for (; laserBeanAngle >= endAngle; laserBeanAngle -= radianFor1Deg) {
        targetX = Math.round(beamPosition.x + Math.cos(laserBeanAngle) * radius);
        targetY = beamPosition.y - Math.sin(laserBeanAngle) * radius;
        targetVector = newVector(targetX, targetY)
        vectors = getDiscreteVectorsBetweenAsteroids(beamPosition, targetVector, true, stepSize).map(vector => roundVector(vector))
        vectors.sort(sortClosestToBeamFirst)

        yield vectors
    }
}

function getVaporizedAsteroidsForOneRotation(asteroidMap, laserBeamPosition, maxResultCount) {
    const vaporizedAsteroids = []
    let error = null

    asteroidMap.delete(makeVectorId(laserBeamPosition))

    while (vaporizedAsteroids.length < maxResultCount && asteroidMap.size > 0 && error === null) {
        const newVisibleAsteroids = new Set()
        const iterator = getBeamDirections(laserBeamPosition, 16)
        let iteratorResult = iterator.next()
        const lastSize = asteroidMap.size

        while (!iteratorResult.done && vaporizedAsteroids.length < maxResultCount && asteroidMap.size > 0 && error === null) {
            let asteroidtoVaporize = undefined;
            let isBehind = false;

            for (const currentAsteroid of iteratorResult.value) {
                const currentAsteroidId = makeVectorId(currentAsteroid)

                if (!asteroidMap.has(currentAsteroidId)) {
                    continue
                }

                if (newVisibleAsteroids.has(currentAsteroidId)) {
                    isBehind = true;
                    continue
                }

                if (asteroidtoVaporize === undefined) {
                    asteroidtoVaporize = currentAsteroid
                }

                newVisibleAsteroids.add(currentAsteroidId)
            }

            if (asteroidtoVaporize !== undefined && isBehind === false) {
                vaporizedAsteroids.push(asteroidtoVaporize)
            }

            iteratorResult = iterator.next()
        }

        vaporizedAsteroids.forEach(vector => asteroidMap.delete(makeVectorId(vector)))

        if (lastSize === asteroidMap.size) {
            error = new Error(`Size must decrease`)
        }
    }

    return { vaporizedAsteroids, error }
}

module.exports = { getBeamDirections, getVaporizedAsteroidsForOneRotation }