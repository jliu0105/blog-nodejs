
const mongoose = require('../db')

// define data format
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true, 
        unique: true
    },
    password: String,
    realname: String
}, { timestamps: true })

// Model matches collection
const User = mongoose.model('user', UserSchema)

module.exports = User
