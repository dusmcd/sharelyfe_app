const { expect } = require('chai')
const { Category, Booking, Post, User, db } = require('../models/index')
const CategoryPost = db.model('category_post')

describe('Category model', () => {
  let post
  let category
  beforeEach(async () => {
    await db.sync({ force: true })
    const postP = Post.create({ title: 'Something', price: 5 })
    const categoryP = Category.create({ name: 'Sports' })
    ;[post, category] = await Promise.all([postP, categoryP])
  })
  afterEach(async () => {
    await db.sync({ force: true })
  })
  it('should contain a name field', async () => {
    expect(category.name).to.not.be.undefined
    expect(category.name).to.equal('Sports')
  })
  it('shoud fail if no name is given', () => {
    Category.create({ name: '' }).catch(err =>
      expect(err.message).to.equal(
        'Validation error: Validation notEmpty on name failed'
      )
    )
    Category.create().catch(err => {
      expect(err.message).to.contain('notNull')
    })
  })
  it('properly associates posts', () => {
    return category.setPosts([post]).then(() => {
      return CategoryPost.findOne({
        where: {
          categoryId: category.id,
          postId: post.id,
        },
      }).then(categoryPostInstance => {
        expect(categoryPostInstance.categoryId).to.equal(category.id)
        expect(categoryPostInstance.postId).to.equal(post.id)
      })
    })
  })
})

describe('Post model', () => {
  beforeEach(async () => {
    await db.sync({ force: true })
  })
  afterEach(async () => {
    await db.sync({ force: true })
  })
  it('creates a post with all the given fields')
  it('fails when certain fields are not given')
  it('properly associates users')
  it('properly associates bookings')
  it('properly associates categories')
})

describe('Booking model', () => {
  beforeEach(async () => {
    await db.sync({ force: true })
  })
  afterEach(async () => {
    await db.sync({ force: true })
  })
  it('creates a booking with given fields')
  it('properly records time')
  it('properly associates posts')
  it('properly associates users')
  it('fails when certain fields are not given')
})

describe('User model', () => {
  beforeEach(async () => {
    await db.sync({ force: true })
  })
  afterEach(async () => {
    await db.sync({ force: true })
  })
  it('creates a user with given fields')
  it('fails when certain fields are not given')
})
