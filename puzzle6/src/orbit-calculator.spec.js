const { decodeOrbit, buildOrbitGraph, countIndirectAndDirectOrbits, buildOrbitTransferGraphFromOrbitGraph, getOrbitalTransferPath } = require('./orbit-calculator')

describe('orbit calculator', () => {
    test('Given orbit string should decode the appropriate orbit object', () => {
        const expectedOrbit = { planet: 'COM', satellit: 'B' }
        const actualOrbit = decodeOrbit('COM)B')

        expect(actualOrbit).toEqual(expectedOrbit)
    })

    test('Given a list or orbits should build an orbit graph', () => {
        const expectedOrbitGraph = new Map([
            ['B', ['COM']],
            ['COM', []],
            ['C', ['B']],
            ['D', ['C']],
            ['E', ['D']],
            ['F', ['E']],
            ['G', ['B']],
            ['H', ['G']],
            ['I', ['D']],
            ['J', ['E']],
            ['K', ['J']],
            ['L', ['K']]
        ]);

        const orbits = [
            { planet: 'COM', satellit: 'B' },
            { planet: 'B', satellit: 'C' },
            { planet: 'C', satellit: 'D' },
            { planet: 'D', satellit: 'E' },
            { planet: 'E', satellit: 'F' },
            { planet: 'B', satellit: 'G' },
            { planet: 'G', satellit: 'H' },
            { planet: 'D', satellit: 'I' },
            { planet: 'E', satellit: 'J' },
            { planet: 'J', satellit: 'K' },
            { planet: 'K', satellit: 'L' }]


        const actualOrbitGraph = buildOrbitGraph(orbits)

        expect(actualOrbitGraph).toEqual(expectedOrbitGraph)
    })

    test('Given an orbit graph should could number of direct and indirect orbits', () => {
        const orbitGraph = new Map([
            ['B', ['COM']],
            ['COM', []],
            ['C', ['B']],
            ['D', ['C']],
            ['E', ['D']],
            ['F', ['E']],
            ['G', ['B']],
            ['H', ['G']],
            ['I', ['D']],
            ['J', ['E']],
            ['K', ['J']],
            ['L', ['K']]
        ]);

        const expectedIndirectAndDirectOrbitCount = 42;

        const actualIndirectAndDirectOrbitCount = countIndirectAndDirectOrbits(orbitGraph);

        expect(actualIndirectAndDirectOrbitCount).toBe(expectedIndirectAndDirectOrbitCount)
    })

    test('Given orbit graph should be transformed into corresponding orbit transfer graph', () => {
        const expectedOrbitTransferGraph = new Map([
            ['COM', ['B']],
            ['B', ['COM', 'C', 'G']],
            ['C', ['B', 'D']],
            ['D', ['C', 'E', 'I']],
            ['E', ['D', 'F', 'J']],
            ['F', ['E']],
            ['G', ['B', 'H']],
            ['H', ['G']],
            ['I', ['D', 'SAN']],
            ['J', ['E', 'K']],
            ['K', ['J', 'L', 'YOU']],
            ['L', ['K']],
            ['YOU', ['K']],
            ['SAN', ['I']]
        ])

        const orbitGraph = new Map([
            ['B', ['COM']],
            ['COM', []],
            ['C', ['B']],
            ['D', ['C']],
            ['E', ['D']],
            ['F', ['E']],
            ['G', ['B']],
            ['H', ['G']],
            ['I', ['D']],
            ['J', ['E']],
            ['K', ['J']],
            ['L', ['K']],
            ['YOU', ['K']],
            ['SAN', ['I']]
        ]);

        const actualOrbitTransferGraph = buildOrbitTransferGraphFromOrbitGraph(orbitGraph)

        expect(actualOrbitTransferGraph).toEqual(expectedOrbitTransferGraph)
    })

    test('abc', () => {
        const expectedOrbitTransferPath = ['K', 'J', 'E', 'D', 'I']
        const orbitTransferGraph = new Map([
            ['COM', ['B']],
            ['B', ['COM', 'C', 'G']],
            ['C', ['B', 'D']],
            ['D', ['C', 'E', 'I']],
            ['E', ['D', 'F', 'J']],
            ['F', ['E']],
            ['G', ['B', 'H']],
            ['H', ['G']],
            ['I', ['D', 'SAN']],
            ['J', ['E', 'K']],
            ['K', ['J', 'L', 'YOU']],
            ['L', ['K']],
            ['YOU', ['K']],
            ['SAN', ['I']]
        ])

        const actualPath = getOrbitalTransferPath(orbitTransferGraph, 'YOU', 'SAN');

        expect(actualPath).toEqual(expectedOrbitTransferPath)
    })
})