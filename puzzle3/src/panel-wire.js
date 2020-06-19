const { newVector, makeVectorId } = require('./vector')
const { direction2Vectors, builVectorMapFromDirections } = require('./input-decoder')

function newWire(wireId, vectorById) {
    return { wireId, vectorById }
}

function builWiresFromDirections(wiresDirections) {
    const wires = []
    let wireId = 0

    for (const wireDirections of wiresDirections) {
        const vectorById = builVectorMapFromDirections(wireDirections)
        wires.push(newWire(wireId, vectorById))
        ++wireId;
    }

    return wires;
}

function manhattanDistance(vectorA, vectorB) {
    return Math.abs(vectorA.x - vectorB.x) + Math.abs(vectorA.y - vectorB.y)
}

function findDuplicateVectorsInWires(wires) {
    const duplicateVectors = []
    const vectorSeen = new Set()

    for (const wire of wires) {
        for (const [vectorId, vector] of wire.vectorById.entries()) {
            if (vectorSeen.has(vectorId)) {
                duplicateVectors.push(vector)
            }
            else {
                vectorSeen.add(vectorId)
            }
        }
    }

    return duplicateVectors
}

function findClosestIntersectionWithManhattanDistance(wiresDirections) {
    const wires = builWiresFromDirections(wiresDirections)
    const duplicateVectors = findDuplicateVectorsInWires(wires)
    const origin = newVector(0, 0)
    const distances = duplicateVectors.map(vector => manhattanDistance(vector, origin))
    const minDistance = Math.min(...distances)

    return minDistance
}

class VectorStepAnnotations {
    constructor() {
        this._annotationByVectorById = new Map()
        this.step = 0;
    }

    getAnnotator() {
        return this._annotate.bind(this)
    }

    getVectorEntries() {
        return this._annotationByVectorById.entries()
    }

    _annotate(vector) {
        const vectorId = makeVectorId(vector)
        const oldStep = this._annotationByVectorById.get(vectorId)

        if (oldStep === undefined) {
            if (vector.x == 0 && vector.y == 0) {
                this.step = 0
            }
            else {
                this.step++
            }

            this._annotationByVectorById.set(vectorId, this.step)
        }
        else {
            this.step = oldStep;
        }
    }
}

function getStepDistanceFromAnnotations(duplicateVectors, wiresVectorIdStepCountPairs) {
    const stepDistances = []

    for (const duplicateVector of duplicateVectors) {
        const duplicateVectorId = makeVectorId(duplicateVector)
        let currentStepDistance = 0;

        for (const wireVectorIdStepCountPairs of wiresVectorIdStepCountPairs) {
            for (const [vectorId, stepDistance] of wireVectorIdStepCountPairs) {
                if (duplicateVectorId === vectorId) {
                    currentStepDistance += stepDistance
                }
            }
        }

        stepDistances.push(currentStepDistance)
    }

    return stepDistances
}

function findClosestIntersectionWithWireSteps(wiresDirections) {
    const wires = builWiresFromDirections(wiresDirections)
    const duplicateVectors = findDuplicateVectorsInWires(wires)

    const duplicateVectors = findDuplicateVectors(wiresVectorArray)
    const distances = getStepDistanceFromAnnotations(duplicateVectors, annotations)
    const minDistance = Math.min(...distances)
    return minDistance
}

module.exports = {
    findClosestIntersectionWithManhattanDistance,
    findClosestIntersectionWithWireSteps,
}