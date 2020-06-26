const { readFile } = require('mz/fs')
const { decodeImageLayers, findLayerWithFewestDigit, countDigitInLayer } = require('./space-image-decoder')

async function main() {
    const content = await readFile('./input.txt', 'utf8');
    const pixels = content.trim().split('').map(x => parseInt(x))

    const layers = decodeImageLayers(pixels, 25, 6)
    const layerWithFewest0 = findLayerWithFewestDigit(layers, 0)
    const antiCorruptionCode = countDigitInLayer(layerWithFewest0, 1) * countDigitInLayer(layerWithFewest0, 2)

    console.log(`Anti corruption code ${antiCorruptionCode}`)
}

main().catch(e => console.error(e))