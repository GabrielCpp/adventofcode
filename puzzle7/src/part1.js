const { readFile } = require('mz/fs')
const { findAmplifierSettingsMaximisingOutput } = require('./amplifier-settings-search')

async function main() {
    const content = await readFile('./input.txt', 'utf8');
    const intCodes = content.trim().split(',').map(x => parseInt(x))
    const bestSettings = findAmplifierSettingsMaximisingOutput(intCodes)
    console.log(bestSettings)
}

main().catch(e => console.error(e))