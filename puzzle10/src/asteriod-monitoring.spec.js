const { getAsteroidFromGrid, getDiscreteVectorsBetweenAsteroids, countVisibleAsteroids, findAsteroidSeingGreatAmountOfAsteroid } = require('./asteriod-monitoring')

describe('Asteroid monitoring', () => {
    test('Given an asteroid map should decode asteroids position', () => {
        const expectedAsteroidsPositions = [
            { x: 1, y: 0 },
            { x: 4, y: 0 },
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
            { x: 3, y: 2 },
            { x: 4, y: 2 },
            { x: 4, y: 3 },
            { x: 3, y: 4 },
            { x: 4, y: 4 }]

        const asteroidGrid = [
            '.#..#',
            '.....',
            '#####',
            '....#',
            '...##',
        ]

        const actualAsteroidsPositions = getAsteroidFromGrid(asteroidGrid)

        expect(actualAsteroidsPositions).toEqual(expectedAsteroidsPositions)
    })

    test('Given 2 asteroids position should find positions in between', () => {
        const expectedVectors = [{ x: 2, y: 2 }]
        const originVector = { x: 3, y: 4 }
        const targetVector = { x: 1, y: 0 }

        const actualVectors = getDiscreteVectorsBetweenAsteroids(originVector, targetVector)

        expect(actualVectors).toEqual(expectedVectors)
    })

    test('Given an asteroid should count accuratly how many asteroid it see', () => {
        const expectedAsteroidsPositions = [
            { x: 1, y: 0 },
            { x: 4, y: 0 },
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
            { x: 3, y: 2 },
            { x: 4, y: 2 },
            { x: 4, y: 3 },
            { x: 3, y: 4 },
            { x: 4, y: 4 }]

        const actualCount = countVisibleAsteroids(expectedAsteroidsPositions, { x: 3, y: 4 })

        expect(actualCount).toBe(8)
    })

    test('Given asteroid positions should find asteroid which see greatest amount of asteroid', () => {
        const expectedResult = { asteroid: { x: 3, y: 4 }, count: 8 }
        const asteroidsPositions = [
            { x: 1, y: 0 },
            { x: 4, y: 0 },
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
            { x: 3, y: 2 },
            { x: 4, y: 2 },
            { x: 4, y: 3 },
            { x: 3, y: 4 },
            { x: 4, y: 4 }]

        const actualResult = findAsteroidSeingGreatAmountOfAsteroid(asteroidsPositions)

        expect(actualResult).toEqual(expectedResult)
    })

    test('Given asteroid should each asteroid match expected amount of seen asteroid', () => {
        const expectedCount = [
            7, 7,
            6, 7, 7, 7, 5, 7,
            8, 7
        ]

        const asteroidsPositions = [
            { x: 1, y: 0 },
            { x: 4, y: 0 },
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
            { x: 3, y: 2 },
            { x: 4, y: 2 },
            { x: 4, y: 3 },
            { x: 3, y: 4 },
            { x: 4, y: 4 }]

        const actualCounts = asteroidsPositions.map(vector => countVisibleAsteroids(asteroidsPositions, vector))

        expect(actualCounts).toEqual(expectedCount)
    })
})

/*

Refer to:

#.........
...A......
...B..a...
.EDCG....a
..F.c.b...
.....c....
..efd.c.gb
.......c..
....f...c.
...e..d..c

*/
describe('Asteroid collision', () => {
    let originVector;
    let asteroidsPositions;

    beforeEach(() => {
        const asteroidGrid = [
            '#.........',
            '...#......',
            '...#..#...',
            '.####....#',
            '..#.#.#...',
            '.....#....',
            '..###.#.##',
            '.......#..',
            '....#...#.',
            '...#..#..#',
        ]

        originVector = { x: 0, y: 0 }
        asteroidsPositions = getAsteroidFromGrid(asteroidGrid);
    })

    const scenarios = [
        // a
        [
            { x: 9, y: 3 },
            [
                { x: 1, y: 0.3333333333333333 },
                { x: 2, y: 0.6666666666666666 },
                { x: 3, y: 1 },
                { x: 4, y: 1.3333333333333333 },
                { x: 5, y: 1.6666666666666665 },
                { x: 6, y: 2 },
                { x: 7, y: 2.333333333333333 },
                { x: 8, y: 2.6666666666666665 }
            ]
        ],
        // b
        [
            { x: 9, y: 6 },
            [
                { x: 1, y: 0.6666666666666666 },
                { x: 2, y: 1.3333333333333333 },
                { x: 3, y: 2 },
                { x: 4, y: 2.6666666666666665 },
                { x: 5, y: 3.333333333333333 },
                { x: 6, y: 4 },
                { x: 7, y: 4.666666666666666 },
                { x: 8, y: 5.333333333333333 }
            ]
        ],
        // c
        [
            { x: 9, y: 9 },
            [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
                { x: 4, y: 4 },
                { x: 5, y: 5 },
                { x: 6, y: 6 },
                { x: 7, y: 7 },
                { x: 8, y: 8 }
            ]
        ],
        // d
        [
            { x: 6, y: 9 },
            [
                { x: 1, y: 1.5 },
                { x: 2, y: 3 },
                { x: 3, y: 4.5 },
                { x: 4, y: 6 },
                { x: 5, y: 7.5 }
            ]
        ],
        // e
        [
            { x: 3, y: 9 },
            [{ x: 1, y: 3 }, { x: 2, y: 6 }]
        ],
        // f
        [
            { x: 4, y: 8 },
            [{ x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 6 }]
        ],
        // g
        [
            { x: 8, y: 6 },
            [
                { x: 1, y: 0.75 },
                { x: 2, y: 1.5 },
                { x: 3, y: 2.25 },
                { x: 4, y: 3 },
                { x: 5, y: 3.75 },
                { x: 6, y: 4.5 },
                { x: 7, y: 5.25 }
            ]
        ]
    ]

    for (const [targetVector, expectedVectors] of scenarios) {
        test(`Given vector at origin with known slope shuold target ${targetVector} produce match expected slope`, () => {
            const actualVectors = getDiscreteVectorsBetweenAsteroids(originVector, targetVector)
            if (expectedVectors.length === 0) console.log(actualVectors)
            expect(actualVectors).toEqual(expectedVectors)
        })
    }


})

describe('Asteroid detector end2end scenarios', () => {
    const scenarios = [
        [
            { asteroid: { x: 5, y: 8 }, count: 33 },
            [
                '......#.#.',
                '#..#.#....',
                '..#######.',
                '.#.#.###..',
                '.#..#.....',
                '..#....#.#',
                '#..#....#.',
                '.##.#..###',
                '##...#..#.',
                '.#....####'
            ]
        ],
        [
            { asteroid: { x: 1, y: 2 }, count: 35 },
            [
                '#.#...#.#.',
                '.###....#.',
                '.#....#...',
                '##.#.#.#.#',
                '....#.#.#.',
                '.##..###.#',
                '..#...##..',
                '..##....##',
                '......#...',
                '.####.###.',
            ]
        ],
        [
            { asteroid: { x: 6, y: 3 }, count: 41 },
            [
                '.#..#..###',
                '####.###.#',
                '....###.#.',
                '..###.##.#',
                '##.##.#.#.',
                '....###..#',
                '..#.#..#.#',
                '#..#.#.###',
                '.##...##.#',
                '.....#.#..',
            ]
        ],
        [
            { asteroid: { x: 11, y: 13 }, count: 210 },
            [
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
            ]
        ]
    ]

    for (const [expectedResult, asteroidGrid] of scenarios) {
        test(`Given asteroid grid should result be ${JSON.stringify(expectedResult)}`, () => {

            const asteroidsPositions = getAsteroidFromGrid(asteroidGrid)
            const actualResult = findAsteroidSeingGreatAmountOfAsteroid(asteroidsPositions)

            expect(actualResult).toEqual(expectedResult)
        })
    }

})