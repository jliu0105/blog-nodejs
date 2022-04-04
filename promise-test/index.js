const fs = require('fs')
const path = require('path')

// get file info with promise
function getFileContent(fileName) {
    const promise = new Promise((resolve, reject) => {
        const fullFileName = path.resolve(__dirname, 'files', fileName)
        fs.readFile(fullFileName, (err, data) => {
            if (err) {
                reject(err)
                return
            }
            resolve(
                JSON.parse(data.toString())
            )
        })
    })
    return promise
}

// getFileContent('a.json').then(aData => {
//     console.log('a data', aData)
//     return getFileContent(aData.next)
// }).then(bData => {
//     console.log('b data', bData)
//     return getFileContent(bData.next)
// }).then(cData => {
//     console.log('c data', cData)
// })

async function readFileData() {
    try {
        const aData = await getFileContent('a.json')
        console.log('a data', aData)
        const bData = await getFileContent(aData.next)
        console.log('b data', bData)
        const cData = await getFileContent(bData.next)
        console.log('c data', cData)
    } catch (err) {
        console.error(err)
    }
}

readFileData()
