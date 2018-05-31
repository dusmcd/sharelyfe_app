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
  it('should contain a name field', () => {
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
  let basketball
  let jerry
  let booking
  beforeEach(async () => {
    await db.sync({ force: true })
    const basketballP = Post.create({
      title: 'Basketball',
      description: 'Foo bar',
      price: 6.0,
    })
    const jerryP = User.create({
      username: 'jerry',
      name: 'Jerry Seinfeld',
      email: 'jseinfeld@gmail.com',
      phone: '949-555-5555',
    })
    const bookingP = Booking.create({
      date: new Date(2018, 11, 10),
      payment: 'Cash',
    })
    ;[basketball, jerry, booking] = await Promise.all([
      basketballP,
      jerryP,
      bookingP,
    ])
  })
  afterEach(async () => {
    await db.sync({ force: true })
  })
  it('creates a post with all the given fields', () => {
    expect(basketball).to.be.an('object')
    expect(basketball.description).to.equal('Foo bar')
    expect(basketball.price).to.equal(6.0)
  })
  it('fails when price is not given or is blank', () => {
    Post.create({
      title: 'Something',
      price: '',
    }).catch(err => expect(err.message).to.contain('notEmpty'))

    Post.create({
      title: 'Testing',
    }).catch(err => expect(err.message).to.contain('notNull'))
  })
  it('fails when title is not given or is blank', () => {
    Post.create({
      title: '',
      price: 7.6,
    }).catch(err => expect(err.message).to.contain('notEmpty'))

    Post.create({
      price: 6.5,
    }).catch(err => expect(err.message).to.contain('notNull'))
  })
  it('properly associates users', async () => {
    await basketball.setUser(jerry)
    expect(basketball.userId).to.equal(jerry.id)
  })
  it('properly associates bookings', async () => {
    await booking.setPost(basketball)
    expect(booking.postId).to.equal(basketball.id)
  })
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
