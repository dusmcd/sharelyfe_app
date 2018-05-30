const express = require('express')
const router = express.Router({ mergeParams: true })
const { Category, Post } = require('../models/index')

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: [Category],
    })
    res.json(posts)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id, {
      include: [Category],
    })
    res.json(post)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const postData = {
      title: req.body.name,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      price: req.body.price,
      categoryId: req.body.categoryId,
    }
    const newPost = await Post.create(postData)
    res.json(newPost)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const postData = {
      title: req.body.name,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      price: req.body.price,
      categoryId: req.body.categoryId,
    }
    await Post.update(postData, { where: { id: req.params.id } })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Post.destroy({ where: { id: req.params.id } })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

module.exports = router
