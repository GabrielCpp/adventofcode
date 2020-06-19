const { newVector, makeVectorId } = require('./vector')
const { last, noop } = require('lodash')

const DIRECTION_LETTER_DELTA_MAP = new Map([
    ['D', newVector(0, -1)],
    ['L', newVector(-1, 0)],
    ['R', newVector(1, 0)],
    ['U', newVector(0, 1)],
])

function direction2Vectors(origin, direction) {
    const directionLetter = direction[0]
    const deltaVector = DIRECTION_LETTER_DELTA_MAP.get(directionLetter)
    const directionJumpCount = parseInt(direction.substring(1))
    const results = []

    for (let currentJump = 1; currentJump <= directionJumpCount; ++currentJump) {
        results.push(newVector(origin.x + deltaVector.x * currentJump, origin.y + deltaVector.y * currentJump))
    }

    return results
}

function builVectorMapFromDirections(wireDirections, annotateVector = noop) {
    const vectorById = new Map()
    let origin = newVector(0, 0)
    const originId = makeVectorId(origin)

    for (const direction of wireDirections) {
        let vectors = direction2Vectors(origin, direction);

        for (const vector of vectors) {
            const vectorId = makeVectorId(vector)

            annotateVector(vector)

            if (vectorId === originId) {
                continue
            }

            if (!vectorById.has(vectorId)) {
                vectorById.set(vectorId, vector)
            }
        }


        origin = last(vectors)
    }

    return vectorById;
}

module.exports = { direction2Vectors, builVectorMapFromDirections }