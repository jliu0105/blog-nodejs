const MongoClient = require('mongodb').MongoClient

const url = 'mongodb://localhost:27017'
const dbName = 'myblog'

MongoClient.connect(
    url,
    {
        // setup
        useUnifiedTopology: true
    },
    (err, client) => {
        if (err) {
            console.error('mongodb connect error', err)
            return
        }

        console.log('mongodb connect success')

        const db = client.db(dbName)

        const usersCollection = db.collection('users')
    
        // search
        usersCollection.find({
            // username: 'jack',
            // password: '123'
        }).toArray((err, result) => {
            if (err) {
                console.error('users find error', err)
                return
            }
            console.log(result)

            client.close()
        })
    }
)
