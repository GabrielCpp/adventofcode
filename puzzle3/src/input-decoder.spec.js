const { builVectorMapFromDirections } = require('./input-decoder')

describe('Wire panel with a simple grid', () => {
    const wiresDirections = ['R1', 'U5', 'L2']
    const expectedVectors = new Map([
        ['1_0', { x: 1, y: 0 }],
        ['1_1', { x: 1, y: 1 }],
        ['1_2', { x: 1, y: 2 }],
        ['1_3', { x: 1, y: 3 }],
        ['1_4', { x: 1, y: 4 }],
        ['1_5', { x: 1, y: 5 }],
        ['0_5', { x: 0, y: 5 }],
        ['-1_5', { x: -1, y: 5 }],
    ])

    test('Given directions should be a corresponding vector array', () => {
        const actualVectors = builVectorMapFromDirections(wiresDirections)
        expect(actualVectors).toEqual(expectedVectors)
    })
})

describe('Wire panel with a ovrided wire', () => {
    const wiresDirections = ['R3', 'L3']

    const expectedVectors = new Map([
        ['1_0', { x: 1, y: 0 }],
        ['2_0', { x: 2, y: 0 }],
        ['3_0', { x: 3, y: 0 }],
    ])

    test('Given same wire passing 2 time at same point should not count twice', () => {
        const actualVectors = builVectorMapFromDirections(wiresDirections)
        expect(actualVectors).toEqual(expectedVectors)
    })

})