const env = process.env.NODE_ENV  // environment parameter

// setup
let MYSQL_CONF
let REDIS_CONF

if (env === 'dev') {
    // mysql
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'Mysql_2018',
        port: '3306',
        database: 'myblog'
    }

    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

if (env === 'production') {
    // mysql
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'Mysql_2018',
        port: '3306',
        database: 'myblog'
    }

    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}