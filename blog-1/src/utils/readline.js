const fs = require('fs')
const path = require('path')
const readline = require('readline')

const fileName = path.join(__dirname, '../', '../', 'logs', 'access.log')
const readStream = fs.createReadStream(fileName)

const rl = readline.createInterface({
    input: readStream
})

let chromeNum = 0
let sum = 0

// read line by line
rl.on('line', (lineData) => {
    if (!lineData) {
        return
    }

    // document the number of line
    sum++

    const arr = lineData.split(' -- ')
    if (arr[2] && arr[2].indexOf('Chrome') > 0) {
        // increase the number of chrome
        chromeNum++
    }
})
// finish
rl.on('close', () => {
    console.log('chrome take: ' + chromeNum / sum)
})

