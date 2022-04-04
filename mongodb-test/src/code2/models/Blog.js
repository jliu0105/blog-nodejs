
const mongoose = require('../db')

const BlogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true 
    },
    content: String,
    author: {
        type: String,
        required: true
    }
})

const Blog = mongoose.model('blog', BlogSchema)

module.exports = Blog
