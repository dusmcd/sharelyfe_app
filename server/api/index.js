const express = require('express')
const router = express.Router()
const categoryRoutes = require('./categories')
const postRoutes = require('./posts')

router.use('/categories', categoryRoutes)
router.use('/posts', postRoutes)

module.exports = router
