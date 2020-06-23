const { readFile } = require('mz/fs')
const { decodeOrbit, buildOrbitGraph, countIndirectAndDirectOrbits } = require('./orbit-calculator')

async function main() {
    const content = await readFile('./input.txt', 'utf8');
    const orbits = content.split('\n').filter(x => x !== '').map(x => decodeOrbit(x))

    const orbitGraph = buildOrbitGraph(orbits)
    const indirectAndDirectOrbitCount = countIndirectAndDirectOrbits(orbitGraph)

    console.log('Total number or orbits and indirect orbits', indirectAndDirectOrbitCount)
}

main().catch(e => console.error(e))