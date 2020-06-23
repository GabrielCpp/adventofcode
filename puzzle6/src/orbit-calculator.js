
function newOrbit(planet, satellit) {
    return { planet, satellit }
}

function decodeOrbit(orbitString) {
    const parts = orbitString.split(')')

    if (parts.length !== 2) {
        throw new Error(`Invalid orbit ${parts}`)
    }

    return newOrbit(parts[0], parts[1])
}

function buildOrbitGraph(orbits) {
    const orbitGraph = new Map()

    for (const orbit of orbits) {
        let edges = orbitGraph.get(orbit.satellit)

        if (edges === undefined) {
            edges = []
            orbitGraph.set(orbit.satellit, edges)
        }

        edges.push(orbit.planet)

        if (!orbitGraph.has(orbit.planet)) {
            orbitGraph.set(orbit.planet, [])
        }
    }

    return orbitGraph
}

function countIndirectAndDirectOrbits(orbitsGraph) {
    const planetWithNoOrbit = Array.from(orbitsGraph.values()).find(orbits => orbits.length === 0)
    let orbitCount = 0;

    for (const [satellite, planets] of orbitsGraph.entries()) {
        if (planets.length === 0) {
            continue;
        }

        const planetStack = [planets]

        while (planetStack.length > 0) {
            const planetStackTop = planetStack.pop()
            for (const planet of planetStackTop) {
                const linkedPlanets = orbitsGraph.get(planet)
                planetStack.push(linkedPlanets)
                ++orbitCount;
            }
        }
    }

    return orbitCount
}

module.exports = { decodeOrbit, buildOrbitGraph, countIndirectAndDirectOrbits }