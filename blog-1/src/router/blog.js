const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    }
}

const handleBlogRouter = (req, res) => {
    const method = req.method // GET POST
    const id = req.query.id

    // get blog list
    if (method === 'GET' && req.path === '/api/blog/list') {
        let author = req.query.author || ''
        const keyword = req.query.keyword || ''
        // const listData = getList(author, keyword)
        // return new SuccessModel(listData)

        if (req.query.isadmin) {
            // admin page
            const loginCheckResult = loginCheck(req)
            if (loginCheckResult) {
                // not signed in
                return loginCheckResult
            }
            // force check my blog
            author = req.session.username
        }

        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }

    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        // const data = getDetail(id)
        // return new SuccessModel(data)
        const result = getDetail(id)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    // create new blog
    if (method === 'POST' && req.path === '/api/blog/new') {
        // const data = newBlog(req.body)
        // return new SuccessModel(data)

        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // not signed in
            return loginCheckResult
        }

        req.body.author = req.session.username
        const result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    // update a blog
    if (method === 'POST' && req.path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // not sign in
            return loginCheckResult
        }

        const result = updateBlog(id, req.body)
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('update blog failed')
            }
        })
    }

    // delete a blog
    if (method === 'POST' && req.path === '/api/blog/del') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // not sign in
            return loginCheckResult
        }

        const author = req.session.username
        const result = delBlog(id, author)
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('delete blog fail')
            }
        })
    }
}

module.exports = handleBlogRouter