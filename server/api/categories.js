const express = require('express')
const router = express.Router({ mergeParms: true })
const { Category, Post } = require('../models/index')

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      include: [Post],
    })
    res.json(categories)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id, {
      include: [Category],
    })
    res.json(category)
  } catch (err) {
    next(err)
  }
})

module.exports = router
