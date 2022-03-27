const querystring = require('querystring')
const { get, set } = require('./src/db/redis')
const { access } = require('./src/utils/log')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// get cookie expire time
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('d.toGMTString() is ', d.toGMTString())
    return d.toGMTString()
}


// post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise
}

const serverHandle = (req, res) => {
    // document access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

    // return JSON
    res.setHeader('Content-type', 'application/json')

    // get path
    const url = req.url
    req.path = url.split('?')[0]

    // deal with query
    req.query = querystring.parse(url.split('?')[1])

    // deal with cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''  // k1=v1;k2=v2;k3=v3
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })


    // deal with session by using redis
    let needSetCookie = false
    let userId = req.cookie.userid
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // get session from redis
        set(userId, {})
    }
    // get session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // get session from redis
            set(req.sessionId, {})
            // set session
            req.session = {}
        } else {
            // set session
            req.session = sessionData
        }
        // console.log('req.session ', req.session)

        // deal with post data
        return getPostData(req)
    })
    .then(postData => {
        req.body = postData

        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }

                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
        
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }

                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }

        // not get router, return 404
        res.writeHead(404, {"Content-type": "text/plain"})
        res.write("404 Not Found\n")
        res.end()
    })
}

module.exports = serverHandle

// process.env.NODE_ENV
