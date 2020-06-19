function newVector(x, y) {
    return { x, y }
}

function makeVectorId(vector) {
    return `${vector.x}_${vector.y}`;
}

function isSameVector(vectorA, vectorB) {
    return vectorA.x === vectorB.x && vectorA.y === vectorB.y
}

module.exports = { newVector, makeVectorId, isSameVector }