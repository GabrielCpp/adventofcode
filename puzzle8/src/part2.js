const { readFile } = require('mz/fs')
const { decodeImageLayers, renderImageFromLayers } = require('./space-image-decoder')

function convertImageToString(image) {
    return image.map(row => row.map(digit => digit === 0 ? ' ' : 'X').join('')).join('\n')
}

async function main() {
    const content = await readFile('./input.txt', 'utf8');
    const pixels = content.trim().split('').map(x => parseInt(x))

    const layers = decodeImageLayers(pixels, 25, 6)
    const image = renderImageFromLayers(layers)

    console.log(convertImageToString(image))
}

main().catch(e => console.error(e))