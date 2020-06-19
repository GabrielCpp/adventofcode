const { findClosestIntersectionWithManhattanDistance, buildWiresVectorArray, VectorStepAnnotations, newVector, makeVectorId } = require('./panel-wire')



describe('Wire panel using wire step distance', () => {
    let annotations;

    beforeEach(() => {
        annotations = new VectorStepAnnotations()
    })

    xtest('Given wire going back to origin should not count as step from origin', () => {
        const wiresDirections = [
            ['R2', 'L3']
        ]

        const expectedEntries = [
            ['1_0', 1],
            ['2_0', 2],
            ['0_0', 0],
            ['-1_0', 1],
        ]

        buildWiresVectorArray(wiresDirections, annotations.getAnnotator())
        const actualEntries = Array.from(annotations.getVectorEntries())

        expect(actualEntries).toEqual(expectedEntries)
    })


    xtest('Given simple wire path should step increase of 1 between each panel wire block ', () => {
        const wiresDirections = [
            ['R1', 'U1', 'L1']
        ]

        const expectedEntries = [
            ['1_0', 1],
            ['1_1', 2],
            ['0_1', 3],
        ]

        buildWiresVectorArray(wiresDirections, annotations.getAnnotator())
        const actualEntries = Array.from(annotations.getVectorEntries())

        expect(actualEntries).toEqual(expectedEntries)
    })
})