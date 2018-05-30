const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const morgan = require('morgan')
// const cloudinary = require('cloudinary')
const path = require('path')
const { db } = require('./models') // connect to db

// // configure cloudinary for uploading images to cloud storage
// cloudinary.config({
//   cloud_name: process.env.CLOUDNAME,
//   api_key: process.env.KEY,
//   api_secret: process.env.SECRET,
// })

app.use(morgan('dev')) // logging middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/api', require('./api/index'))

// error handling

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).send('<h1>Internal Server Error</h1>')
})
app.use((req, res, next) => {
  res.status(404).send('<h1>Sorry that page does not exist</h1>')
})

const PORT = 8080

//set up server
db.sync().then(() => {
  console.log('db is synced')
  app.listen(8080, 'localhost', function() {
    console.log(`The server is listening on port ${PORT}`)
  })
})
