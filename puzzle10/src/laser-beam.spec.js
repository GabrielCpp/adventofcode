const { getVaporizedAsteroidsForOneRotation, getVectorAngle } = require('./laser-beam')
const { getAsteroidFromGrid, buildAsteroidMap, getDiscreteVectorsBetweenAsteroids } = require('./asteriod-monitoring')
const { makeVectorId, isVectorEqual, roundVector } = require('./vector')

describe('Laser beam', () => {
    const laserBeamPosition = { x: 8, y: 3 }
    const asteroidPositions = getAsteroidFromGrid([
        '.#....#####...#..',
        '##...##.#####..##',
        '##...#...#.#####.',
        '..#.....#...###..',
        '..#.#.....#....##',
    ])

    let asteroidMap;

    beforeEach(() => {
        asteroidMap = buildAsteroidMap(asteroidPositions);
    })

    test('First 2 octans vaporized asteroids', () => {
        const expectedVaporizedAsteroid = [
            { x: 8, y: 1 },
            { x: 9, y: 0 },
            { x: 9, y: 1 },
            { x: 10, y: 0 },
            { x: 9, y: 2 },
            { x: 11, y: 1 },
            { x: 12, y: 1 },
            { x: 11, y: 2 },
            { x: 15, y: 1 },

            { x: 12, y: 2 },
            { x: 13, y: 2 },
            { x: 14, y: 2 },
            { x: 15, y: 2 },
            { x: 12, y: 3 },
            { x: 16, y: 4 },
            { x: 15, y: 4 },
            { x: 10, y: 4 },
            { x: 4, y: 4 },

            { x: 2, y: 4 },
            { x: 2, y: 3 },
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 5, y: 2 },
            { x: 1, y: 0 },
            { x: 5, y: 1 },

            { x: 6, y: 1 },
            { x: 6, y: 0 },
            { x: 7, y: 0 },
            { x: 8, y: 0 },
            { x: 10, y: 1 },
            { x: 14, y: 0 },
            { x: 16, y: 1 },
            { x: 13, y: 3 },
            { x: 14, y: 3 },
        ]

        const actualVaporizedAsteroids = getVaporizedAsteroidsForOneRotation(asteroidMap, laserBeamPosition, expectedVaporizedAsteroid.length)

        expect(actualVaporizedAsteroids).toEqual({ vaporizedAsteroids: expectedVaporizedAsteroid, error: null })
    })
})

xdescribe('Laser beam large', () => {
    const laserBeamPosition = { x: 11, y: 13 }
    const asteroidPositions = getAsteroidFromGrid([

        '.#..##.###...#######',
        '##.############..##.',
        '.#.######.########.#',
        '.###.#######.####.#.',
        '#####.##.#.##.###.##',
        '..#####..#.#########',
        '####################',
        '#.####....###.#.#.##',
        '##.#################',
        '#####.##.###..####..',
        '..######..##.#######',
        '####.##.####...##..#',
        '.#####..#.######.###',
        '##...#.##########...',
        '#.##########.#######',
        '.####.#.###.###.#.##',
        '....##.##.###..#####',
        '.#.#.###########.###',
        '#.#.#.#####.####.###',
        '###.##.####.##.#..##',

    ])

    let asteroidMap;

    beforeEach(() => {
        asteroidMap = buildAsteroidMap(asteroidPositions);
    })

    test('', () => {
        const actualVaporizedAsteroids = getVaporizedAsteroidsForOneRotation(asteroidMap, laserBeamPosition, 300)
        console.log(actualVaporizedAsteroids)
    })
})