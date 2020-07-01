
function newVector(x, y) {
    return { x, y }
}

function makeVectorId(vector) {
    function round4(v) {
        const valueFactor = v * 1e4
        const intValue = Math.floor(valueFactor)
        const hasDecimal = valueFactor - intValue > 0.5

        return (intValue + (hasDecimal ? 1 : 0)) / 1e4
    }

    return `${round4(vector.x)}_${round4(vector.y)}`
}

function isVectorEqual(lhsVector, rhsVector) {
    return Math.abs(lhsVector.x - rhsVector.x) < 1e-4 && Math.abs(lhsVector.y - rhsVector.y) < 1e-4
}

function computeLinearRegressionForX(linearRegression, x) {
    return linearRegression.slope * x + linearRegression.constantValue
}

function newLinearRegression(slope, constantValue) {
    return { slope, constantValue }
}

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

function getDiscreteVectorsBetweenAsteroids(originVector, targetVector) {
    const vectors = []

    function useLinearRegression() {
        const linearRegression = getLinearRegressionFrom(originVector, targetVector)
        const fromX = Math.min(originVector.x, targetVector.x) + 1
        const toX = Math.max(originVector.x, targetVector.x)

        for (let x = fromX; x < toX; ++x) {
            const y = computeLinearRegressionForX(linearRegression, x)
            const vector = newVector(x, y)
            vectors.push(vector)
        }
    }

    function slideOnX() {
        const fromX = Math.min(originVector.x, targetVector.x) + 1
        const toX = Math.max(originVector.x, targetVector.x)

        for (let x = fromX; x < toX; ++x) {
            const vector = newVector(x, originVector.y)
            vectors.push(vector)
        }
    }


    function slideOnY() {
        const fromY = Math.min(originVector.y, targetVector.y) + 1
        const toY = Math.max(originVector.y, targetVector.y)

        for (let y = fromY; y < toY; ++y) {
            const vector = newVector(originVector.x, y)
            vectors.push(vector)
        }
    }

    if (originVector.y === targetVector.y) {
        slideOnX()
    }
    else if (originVector.x === targetVector.x) {
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
    findAsteroidSeingGreatAmountOfAsteroid
}