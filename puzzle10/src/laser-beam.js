const { newVector, makeVectorId, isVectorEqual, computeLinearRegressionForX, newLinearRegression, isFloatEqual, roundVector, round4 } = require('./vector')
const { getDiscreteVectorsBetweenAsteroids } = require('./asteriod-monitoring')


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
function* getAngles(deltaRadian) {
    let laserBeanAngle = Math.PI / 2
    let endAngle = 0

    for (; laserBeanAngle > endAngle; laserBeanAngle -= deltaRadian) {
        yield laserBeanAngle
    }

    laserBeanAngle = 2 * Math.PI
    endAngle = Math.PI / 2

    for (; laserBeanAngle > endAngle; laserBeanAngle -= deltaRadian) {
        yield laserBeanAngle
    }
}

function inRange(value, from, to) {
    return value >= from && value <= to;
}

function getVectorAngle(laserBeamPosition, vector) {
    let vectorAngle;

    if (vector.x === laserBeamPosition.x) {
        vectorAngle = Math.PI / 2;
    }
    else if (vector.y === laserBeamPosition.y) {
        vectorAngle = 0;
    }
    else {
        vectorAngle = Math.abs(Math.atan((vector.y - laserBeamPosition.y) / (vector.x - laserBeamPosition.x)))
    }

    return vectorAngle
}


function getVaporizedAsteroidsForOneRotation(asteroidMap, laserBeamPosition, maxResultCount) {
    const positionCompare = buildPositionCompare(laserBeamPosition)
    const radianFor1Deg = 1 / 360 * Math.PI
    const vaporizedAsteroids = []
    let error = null

    asteroidMap.delete(makeVectorId(laserBeamPosition))

    while (vaporizedAsteroids.length < maxResultCount && asteroidMap.size > 0 && error === null) {
        const newVisibleAsteroids = new Set()
        const lastSize = asteroidMap.size

        for (const currentAngle of getAngles(radianFor1Deg)) {
            const possibleVectorWithAngles = []

            for (const vector of asteroidMap.values()) {

                if (vector.x >= laserBeamPosition.x && vector.y < laserBeamPosition.y && !inRange(currentAngle, 0, Math.PI / 2)) {
                    continue;
                }

                if (vector.x > laserBeamPosition.x && vector.y >= laserBeamPosition.y && !inRange(currentAngle, 3 * Math.PI / 2, 2 * Math.PI)) {
                    continue;
                }

                if (vector.x <= laserBeamPosition.x && vector.y > laserBeamPosition.y && !inRange(currentAngle, Math.PI, 3 * Math.PI / 2)) {
                    continue;
                }

                if (vector.x < laserBeamPosition.x && vector.y <= laserBeamPosition.y && !inRange(currentAngle, Math.PI / 2, Math.PI)) {
                    continue;
                }

                let vectorAngle = getVectorAngle(laserBeamPosition, vector)

                if (inRange(currentAngle, 3 * Math.PI / 2, 2 * Math.PI)) {
                    vectorAngle = 2 * Math.PI - vectorAngle
                }

                if (inRange(currentAngle, Math.PI, 3 * Math.PI / 2)) {
                    vectorAngle = Math.PI + vectorAngle
                }

                if (inRange(currentAngle, Math.PI / 2, Math.PI)) {
                    vectorAngle = Math.PI - vectorAngle
                }

                if (Math.abs(vectorAngle - currentAngle) < 0.01) {
                    possibleVectorWithAngles.push({ vectorAngle, vector })
                }
            }

            possibleVectorWithAngles.sort((vectorWithAngle1, vectorWithAngle2) => positionCompare(vectorWithAngle1.vector, vectorWithAngle2.vector))

            let asteroidtoVaporize = undefined;
            for (const vectorWithAngle of possibleVectorWithAngles) {
                const currentAsteroidId = makeVectorId(vectorWithAngle.vector)

                if (newVisibleAsteroids.has(currentAsteroidId)) {
                    continue
                }

                if (asteroidtoVaporize === undefined) {
                    asteroidtoVaporize = vectorWithAngle.vector
                    asteroidMap.delete(currentAsteroidId)
                }

                newVisibleAsteroids.add(currentAsteroidId)
            }

            if (asteroidtoVaporize !== undefined) {
                vaporizedAsteroids.push(asteroidtoVaporize)
            }
        }

        if (lastSize === asteroidMap.size) {
            error = new Error(`Size must decrease`)
            console.log(asteroidMap)
        }
    }

    return { vaporizedAsteroids, error }
}

module.exports = { getVaporizedAsteroidsForOneRotation, getVectorAngle }