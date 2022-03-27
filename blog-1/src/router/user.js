const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set } = require('../db/redis')

const handleUserRouter = (req, res) => {
    const method = req.method // GET POST

    // sign in
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body
        // const { username, password } = req.query
        const result = login(username, password)
        return result.then(data => {
            if (data.username) {
                // set session
                req.session.username = data.username
                req.session.realname = data.realname
                // redis
                set(req.sessionId, req.session)

                return new SuccessModel()
            }
            return new ErrorModel('sign in fail')
        })
    }

}

module.exports = handleUserRouter
