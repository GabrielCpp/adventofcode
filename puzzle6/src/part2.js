const { readFile } = require('mz/fs')
const { decodeOrbit, buildOrbitGraph, getOrbitalTransferPath, buildOrbitTransferGraphFromOrbitGraph } = require('./orbit-calculator')

async function main() {
    const content = await readFile('./input.txt', 'utf8');
    const orbits = content.split('\n').filter(x => x !== '').map(x => decodeOrbit(x))

    const orbitGraph = buildOrbitGraph(orbits)
    const orbitTransferGraph = buildOrbitTransferGraphFromOrbitGraph(orbitGraph)
    const orbitTransferPath = getOrbitalTransferPath(orbitTransferGraph, 'YOU', 'SAN')

    console.log('Total number or orbits and indirect orbits', orbitTransferPath.length - 1)
}

main().catch(e => console.error(e))

// 790 too high