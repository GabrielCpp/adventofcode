const { last } = require('lodash')

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

function buildOrbitTransferGraphFromOrbitGraph(orbitsGraph) {
    const orbitTransferGraph = new Map()

    for (const [planet, satellites] of orbitsGraph.entries()) {
        for (const satellite of satellites) {
            let orbitTransfer = orbitTransferGraph.get(satellite)

            if (orbitTransfer === undefined) {
                orbitTransfer = []
                orbitTransferGraph.set(satellite, orbitTransfer)
            }

            orbitTransfer.push(planet)
        }

        let orbitTransfer = orbitTransferGraph.get(planet)

        if (orbitTransfer === undefined) {
            orbitTransfer = []
            orbitTransferGraph.set(planet, orbitTransfer)
        }

        satellites.forEach(satellite => orbitTransfer.push(satellite))
    }

    return orbitTransferGraph
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

function popDirection(directions, pathChoosen) {
    while (directions.length > 0) {
        const lastDirectionArray = last(directions)

        if (lastDirectionArray.length > 0) {
            lastDirectionArray.pop()
            pathChoosen.pop()
            break;
        }
        else {
            directions.pop()
            pathChoosen.pop()
        }
    }
}

function getOrbitalTransferPath(orbitTransferGraph, fromObject, toObject) {
    const directObitTransfers = orbitTransferGraph.get(fromObject)
    const directions = [[...directObitTransfers]]
    const pathChoosen = []
    let shortestPath = undefined
    let nodeSeens = new Set([fromObject])

    while (directions.length > 0) {
        const orbitTransfer = last(last(directions))

        if (orbitTransfer === toObject) {
            if (shortestPath === undefined || pathChoosen.length < shortestPath.length) {
                shortestPath = [...pathChoosen]
            }

            popDirection(directions, pathChoosen)
            continue;
        }

        pathChoosen.push(orbitTransfer)
        nodeSeens.add(orbitTransfer)

        const allAvaibleOrbitTransfers = orbitTransferGraph.get(orbitTransfer) || []
        const nextAvaibleOrbitTransfers = allAvaibleOrbitTransfers.filter(node => !nodeSeens.has(node))

        if (nextAvaibleOrbitTransfers.length > 0) {
            directions.push([...nextAvaibleOrbitTransfers])
        }
        else {
            popDirection(directions, pathChoosen)
        }
    }

    return shortestPath
}

module.exports = { decodeOrbit, buildOrbitGraph, countIndirectAndDirectOrbits, getOrbitalTransferPath, buildOrbitTransferGraphFromOrbitGraph }