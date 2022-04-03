const express = require('express')

const app = express()

app.use((req, res, next) => {
    console.log('request start...', req.method, req.url)
    next()
})

app.use((req, res, next) => {
    // pretend to deal with cookie
    req.cookie = {
        userId: 'abc123'
    }
    next()
})

app.use((req, res, next) => {
    // pretend to deal with post data
    // async
    setTimeout(() => {
        req.body = {
            a: 100,
            b: 200
        }
        next()
    })
})

app.use('/api', (req, res, next) => {
    console.log('deal /api router')
    next()
})

app.get('/api', (req, res, next) => {
    console.log('get /api router')
    next()
})
app.post('/api', (req, res, next) => {
    console.log('post /api router')
    next()
})

// fake login
function loginCheck(req, res, next) {
    setTimeout(() => {
        console.log('fake login fail')
        res.json({
            errno: -1,
            msg: 'login fail'
        })

    })
}

app.get('/api/get-cookie', loginCheck, (req, res, next) => {
    console.log('get /api/get-cookie')
    res.json({
        errno: 0,
        data: req.cookie
    })
})

app.post('/api/get-post-data', loginCheck, (req, res, next) => {
    console.log('post /api/get-post-data')
    res.json({
        errno: 0,
        data: req.body
    })
})

app.use((req, res, next) => {
    console.log('deal with 404')
    res.json({
        errno: -1,
        msg: '404 not fount'
    })
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
})