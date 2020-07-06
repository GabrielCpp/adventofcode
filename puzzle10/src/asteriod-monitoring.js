const { newVector, makeVectorId, isVectorEqual, computeLinearRegressionForX, newLinearRegression, isFloatEqual } = require('./vector')

function getAsteroidFromGrid(grid) {
    let x = 0;
    let y = 0;
    const asteroidPositions = []

    for (const row of grid) {
        x = 0;

        for (const element of row) {
            if (element === '#') {
                asteroidPositions.push(newVector(x, y))
            }

            x++
        }

        y++;
    }

    return asteroidPositions
}

function getLinearRegressionFrom(originVector, targetVector) {
    const slope = (targetVector.y - originVector.y) / (targetVector.x - originVector.x)
    const constantFactor = originVector.y - slope * originVector.x

    return newLinearRegression(slope, constantFactor)
}

function getDiscreteVectorsBetweenAsteroids(originVector, targetVector, includeTargetVector = false, stepSize = 1) {
    const vectors = []
    const endCompare = includeTargetVector ? (current, max) => current <= max : (current, max) => current < max

    function useLinearRegression() {
        const linearRegression = getLinearRegressionFrom(originVector, targetVector)
        const fromX = Math.min(originVector.x, targetVector.x) + 1
        const toX = Math.max(originVector.x, targetVector.x)

        for (let x = fromX; endCompare(x, toX); x += stepSize) {
            const y = computeLinearRegressionForX(linearRegression, x)
            const vector = newVector(x, y)
            vectors.push(vector)
        }
    }

    function slideOnX() {
        const fromX = Math.min(originVector.x, targetVector.x) + 1
        const toX = Math.max(originVector.x, targetVector.x)

        for (let x = fromX; endCompare(x, toX); ++x) {
            const vector = newVector(x, originVector.y)
            vectors.push(vector)
        }
    }


    function slideOnY() {
        const fromY = Math.min(originVector.y, targetVector.y) + 1
        const toY = Math.max(originVector.y, targetVector.y)

        for (let y = fromY; endCompare(y, toY); ++y) {
            const vector = newVector(originVector.x, y)
            vectors.push(vector)
        }
    }

    if (isFloatEqual(originVector.y, targetVector.y)) {
        slideOnX()
    }
    else if (isFloatEqual(originVector.x, targetVector.x)) {
        slideOnY()
    }
    else {
        useLinearRegression()
    }

    return vectors
}

function countVisibleAsteroids(asteroidVectors, originAsteroidVector, asteroidMap = undefined) {
    let visibleAsteroidCount = 0;
    asteroidMap = asteroidMap || buildAsteroidMap(asteroidVectors)

    for (const targetAsteroidVector of asteroidVectors) {
        if (isVectorEqual(originAsteroidVector, targetAsteroidVector)) {
            continue
        }

        const vectors = getDiscreteVectorsBetweenAsteroids(originAsteroidVector, targetAsteroidVector)
        const isHiddentByOtherAsteroid = vectors.some(vector => asteroidMap.has(makeVectorId(vector)))

        if (isHiddentByOtherAsteroid === false) {
            visibleAsteroidCount++;
        }
    }

    return visibleAsteroidCount
}

function buildAsteroidMap(asteroidVectors) {
    const map = new Map()

    asteroidVectors.forEach(vector => map.set(makeVectorId(vector), vector))

    return map
}

function findAsteroidSeingGreatAmountOfAsteroid(asteroidVectors) {
    let asteroidSeingGreatAmountOfAsteroid = { asteroid: asteroidVectors[0], count: 0 }
    const asteroidMap = buildAsteroidMap(asteroidVectors);

    for (const originAsteroidVector of asteroidVectors) {
        const count = countVisibleAsteroids(asteroidVectors, originAsteroidVector, asteroidMap)

        if (count > asteroidSeingGreatAmountOfAsteroid.count) {
            asteroidSeingGreatAmountOfAsteroid = { asteroid: originAsteroidVector, count }
        }
    }

    return asteroidSeingGreatAmountOfAsteroid
}

module.exports = {
    getAsteroidFromGrid,
    getDiscreteVectorsBetweenAsteroids,
    countVisibleAsteroids,
    findAsteroidSeingGreatAmountOfAsteroid,
    buildAsteroidMap
}