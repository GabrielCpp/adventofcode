function buildRangeRow(min, max, getId) {
    const elements = []

    for (let i = 0; i <= 9; ++i) {
        if (i < min || i > max) {
            elements.push('')
        }
        else {
            elements.push(getId(i))
        }
    }
    return elements;
}

function buildIncreasingNumberGraph(firstConstraint) {
    const graph = {}
    const rangeToGenerate = new Map()

    for (const index in firstConstraint) {
        const [min, max] = firstConstraint[index]
        graph[index] = buildRangeRow(min, max, i => {
            if (i === min && index < firstConstraint.length - 1) {
                return String(Number(index) + 1)
            }
            else if (!rangeToGenerate.has(`${i}-9`)) {
                rangeToGenerate.set(`${i}-9`, [i, 9])
            }

            return `${i}-9`
        })
    }

    for (const [min, max] of rangeToGenerate.values()) {
        graph[`${min}-${max}`] = buildRangeRow(min, max, i => {
            return `${i}-9`
        })
    }

    return graph
}


function calculatePermutation({ graph, depth, line, lastDigit, hasAdjacentDigit }) {
    if (depth === 6) {
        return 0
    }

    if (depth === 5 && hasAdjacentDigit === false) {
        return 1;
    }

    let nbPermutation = 0;

    for (const vertexIndex in graph[line]) {
        const vertex = graph[line][vertexIndex]

        if (vertex) {
            if (depth === 5) {
                ++nbPermutation;
            }
            else {
                const adjacentDigit = (lastDigit === vertexIndex) || hasAdjacentDigit
                nbPermutation += calculatePermutation({ graph, depth: depth + 1, line: vertex, lastDigit: vertexIndex, hasAdjacentDigit: adjacentDigit })
            }
        }
    }

    return nbPermutation
}

const graph = buildIncreasingNumberGraph([[2, 7], [7, 9]])
const nbPermutation = calculatePermutation({ graph, depth: 0, line: 0, lastDigit: -1, hasAdjacentDigit: false })

console.log(graph)
console.log(`Different passwords count: ${nbPermutation}`)

