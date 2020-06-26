const { decodeImageLayers, countDigitInLayer, renderImageFromLayers } = require('./space-image-decoder')

describe('Space image decoder', () => {
    test('Given pixels stream should decode proper image', () => {
        const expectedLayer = [[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [0, 1, 2]]]
        const pixels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2]

        const actualLayers = decodeImageLayers(pixels, 3, 2)

        expect(actualLayers).toEqual(expectedLayer)
    })

    test('Given counting number of 2 in a layer should count digit in each row', () => {
        const layer = [[1, 2, 3], [2, 2, 6]]

        const actualCount = countDigitInLayer(layer, 2)

        expect(actualCount).toBe(3)
    })

    test('Given layers should be able to render image from layers', () => {
        const expectedImage = [[0, 1], [1, 0]]
        const layers = [[[0, 2], [2, 2]], [[1, 1], [2, 2]], [[2, 2], [1, 2]], [[0, 0], [0, 0]]]

        const actualImage = renderImageFromLayers(layers)

        expect(actualImage).toEqual(expectedImage)
    })
})