const { WireVectorStepAnnotations, builWiresFromDirections, findClosestIntersectionWithWireSteps } = require('./panel-wire')
const { builVectorMapFromDirections } = require('./input-decoder')


describe('Wire panel using wire step distance', () => {
    let annotations;

    beforeEach(() => {
        annotations = new WireVectorStepAnnotations()
    })

    test('Given wire going back to origin should not count as step from origin', () => {
        const wiresDirections = ['R2', 'L3']
        const expectedEntries = [
            ['1_0', 1],
            ['2_0', 2],
            ['0_0', 0],
            ['-1_0', 3],
        ]

        builVectorMapFromDirections(wiresDirections, annotations.getAnnotator())
        const actualEntries = Array.from(annotations.getVectorEntries())

        expect(actualEntries).toEqual(expectedEntries)
    })


    test('Given simple wire path should step increase of 1 between each panel wire block ', () => {
        const wiresDirections = ['R1', 'U1', 'L1']
        const expectedEntries = [
            ['1_0', 1],
            ['1_1', 2],
            ['0_1', 3],
        ]

        builVectorMapFromDirections(wiresDirections, annotations.getAnnotator())
        const actualEntries = Array.from(annotations.getVectorEntries())

        expect(actualEntries).toEqual(expectedEntries)
    })
})

describe('Find closest step distance', () => {
    test('A', () => {
        const wiresDirections = [
            ['R75', 'D30', 'R83', 'U83', 'L12', 'D49', 'R71', 'U7', 'L72'],
            ['U62', 'R66', 'U55', 'R34', 'D71', 'R55', 'D58', 'R83']
        ]

        const actualClosestDistance = findClosestIntersectionWithWireSteps(wiresDirections)
        expect(actualClosestDistance).toBe(610)
    })

    test('B', () => {
        const wiresDirections = [
            ['R98', 'U47', 'R26', 'D63', 'R33', 'U87', 'L62', 'D20', 'R33', 'U53', 'R51'],
            ['U98', 'R91', 'D20', 'R16', 'D67', 'R40', 'U7', 'R15', 'U6', 'R7']
        ]

        const actualClosestDistance = findClosestIntersectionWithWireSteps(wiresDirections)
        expect(actualClosestDistance).toBe(410)
    })
})
