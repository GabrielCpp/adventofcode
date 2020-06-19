const { readFile } = require('mz/fs')
const { findClosestIntersectionWithWireSteps } = require('./panel-wire')

async function main() {
    const content = await readFile('./input.txt', 'utf8');
    const directions = content.split('\n').filter(line => line != '').map(line => line.split(','))
    const minDistance = findClosestIntersectionWithWireSteps(directions)

    console.log('Min distance', minDistance)
}

main().catch(e => console.error(e))