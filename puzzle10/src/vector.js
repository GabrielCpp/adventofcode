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

function isFloatEqual(a, b) {
    return Math.abs(a - b) < 1e-4
}

function isVectorEqual(lhsVector, rhsVector) {
    return isFloatEqual(lhsVector.x, rhsVector.x) && isFloatEqual(lhsVector.y, rhsVector.y);
}

function computeLinearRegressionForX(linearRegression, x) {
    return linearRegression.slope * x + linearRegression.constantValue
}

function newLinearRegression(slope, constantValue) {
    return { slope, constantValue }
}

module.exports = { newVector, makeVectorId, isVectorEqual, computeLinearRegressionForX, newLinearRegression, isFloatEqual }