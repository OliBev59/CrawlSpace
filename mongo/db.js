//calling in MongoDB
const MongoClient = require('mongodb').MongoClient

//specifiying Mongo connection URL
const url = 'mongodb://127.0.0.1:27017'

//connecting to MongoDB
MongoClient.connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err, client) => {
      if (err) {
        return console.log(err)
      }
  
      // specifying the database you want to access
      const db = client.db('pubsDB')
  
      console.log(`MongoDB Connected: ${url}`)
      // specfiying collection within the database
      const customerCollection = db.collection('customers')
      customerCollection.find().toArray((err, results) => {
        console.log(results)
      })
    //   example adding a new element to database - courses.insertOne({ name: 'Web Security' }, (err, result) => {})
    }
  )

