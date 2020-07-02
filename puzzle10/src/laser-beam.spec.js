const { getBeamDirections, getVaporizedAsteroidsForOneRotation } = require('./laser-beam')
const { getAsteroidFromGrid } = require('./asteriod-monitoring')

describe('Laser beam', () => {
    const asteroidPositions = getAsteroidFromGrid([
        '.#....#####...#..',
        '##...##.#####..##',
        '##...#...#.#####.',
        '..#.....#...###..',
        '..#.#.....#....##',
    ])

    const laserBeamPosition = { x: 8, y: 3 }

    test('', () => {
        const iterator = getBeamDirections(asteroidPositions, laserBeamPosition)
        iterator.next()
        iterator.next()
        iterator.next()
        iterator.next()
        iterator.next()
        iterator.next()
        iterator.next()
        console.log(iterator.next())
    })
})