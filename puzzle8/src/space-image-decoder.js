
function decodeImageLayers(pixels, width, height) {
    const layers = []
    const layerSize = width * height

    for (let iLayerStart = 0; iLayerStart < pixels.length; iLayerStart += layerSize) {
        const layer = []

        for (let iRow = 0; iRow < height; iRow++) {
            const row = pixels.slice(iLayerStart + iRow * width, iLayerStart + iRow * width + width)
            layer.push(row)
        }

        layers.push(layer)
    }

    return layers
}

function countDigitInLayer(layer, digitToCount) {
    let layerDigitCount = 0

    for (const row of layer) {
        for (const currentDigit of row) {
            if (currentDigit === digitToCount) {
                layerDigitCount++
            }
        }
    }

    return layerDigitCount
}

function findLayerWithFewestDigit(layers, digitToCount) {
    let lestDigitLayer = { layer: layers[0], layerDigitCount: Infinity }

    for (const layer of layers) {
        const layerDigitCount = countDigitInLayer(layer, digitToCount)

        if (layerDigitCount < lestDigitLayer.layerDigitCount) {
            lestDigitLayer = { layer, layerDigitCount }
        }
    }

    return lestDigitLayer.layer
}

function renderImageFromLayers(layers) {
    const renderedImage = Array.from({ length: layers[0].length }, () => Array.from({ length: layers[0][0].length }, () => 2))

    layers.reduceRight((image, layer) => {
        for (const rowIndex in layer) {
            for (const columnIndex in layer[rowIndex]) {
                if (layer[rowIndex][columnIndex] !== 2) {
                    image[rowIndex][columnIndex] = layer[rowIndex][columnIndex]
                }
            }
        }

        return image

    }, renderedImage)

    return renderedImage
}

module.exports = { decodeImageLayers, findLayerWithFewestDigit, countDigitInLayer, renderImageFromLayers }