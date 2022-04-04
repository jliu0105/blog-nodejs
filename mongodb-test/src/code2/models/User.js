
const mongoose = require('../db')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true, 
        unique: true 
    },
    password: String,
    realname: String
})

// Model corespond collection
const User = mongoose.model('user', UserSchema)

module.exports = User
