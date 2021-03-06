const { genPassword } = require('../utils/cryp')
const User = require('../db/models/User')

const login = async (username, password) => {

    password = genPassword(password)

    const userList = await User.find({
        username,
        password
    })

    if (userList.length === 0) return {}
    return userList[0]
}

module.exports = {
    login
}