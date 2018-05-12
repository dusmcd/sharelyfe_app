const { db, Booking, Category, Post, User } = require('../server/models/index');
const CategoryPost = db.model('category_post');

const categories = [{ name: 'Parking' }];

const users = [
  {
    username: 'dusmcd',
    name: 'Dustin McDowell',
    phone: '555-5555',
    email: 'dustin@email.com',
  },
  {
    username: 'jradford',
    name: 'Jordan Radford',
    phone: '444-44444',
    email: 'jordan@email.com',
  },
  {
    username: 'bobsmith',
    name: 'Bob Smith',
    phone: '555-5555',
    email: 'bob@email.com',
  },
  {
    username: 'helgap',
    name: 'Helga Patacki',
    phone: '777-7777',
    email: 'helga@email.com',
  },
  {
    username: 'jwindsor',
    name: 'Jane Windsor',
    phone: '555-5555',
    email: 'mswindsor@email.com',
  },
];

const posts = [
  {
    imageUrl:
      'https://urbanmatter.com/chicago/wp-content/uploads/2015/07/Hotel-Parking.jpg',
    title: 'Parking for Something Else',
    description: "You're going to like the way you park. I guarantee it",
    price: 7,
  },
  {
    imageUrl: 'http://www.carfab.com/wp-content/uploads/2017/04/parking.png',
    title: 'Parking for Concert',
    description: 'Only cool people park here. You are cool, right??',
    price: 6,
  },
  {
    imageUrl:
      'http://cdntdreditorials.azureedge.net/cache/c/d/8/9/3/1/cd8931a86ea2b5b7a770ceae856c791942ab1e17.jpg',
    title: 'Parking for My House',
    description: 'Get of my lawn!',
    price: 8,
  },
  {
    imageUrl:
      'http://cdntdreditorials.azureedge.net/cache/c/d/8/9/3/1/cd8931a86ea2b5b7a770ceae856c791942ab1e17.jpg',
    title: 'Parking for Disney',
    description: 'You can park here if you really want to',
    price: 5,
  },
  {
    imageUrl:
      'https://urbanmatter.com/chicago/wp-content/uploads/2015/07/Hotel-Parking.jpg',
    title: 'Parking for Disney',
    description: 'You can park here if you really want to',
    price: 5,
  },
];

const bookings = [
  { date: new Date(2018, 6, 15), payment: 'Cash' },
  { date: new Date(2018, 6, 13), payment: 'Venmo' },
  { date: new Date(2018, 6, 10), payment: 'Cash' },
  { date: new Date(2018, 7, 9), payment: 'Credit Card' },
  { date: new Date(2018, 8, 15), payment: 'Paypal' },
];

db
  .sync({ force: true })
  .then(() => {
    return createAllPromises();
  })
  .then(results => {
    const [categoryArr, postArr] = results;
    const categoryMapP = postArr.map((category, i) => {
      CategoryPost.create({
        categoryId: categoryArr[0].id,
        postId: postArr[i].id,
      });
    });
    return Promise.all(categoryMapP);
  })
  .then(() => {
    console.log('Seeding successful!');
    db.close();
  })
  .catch(err => {
    console.error(err.message);
    db.close();
  });

function createUserPromises() {
  return Promise.all(
    users.map(user => {
      return User.create(user);
    })
  );
}

function createPostPromises(userPromise) {
  return userPromise
    .then(userArray => {
      return Promise.all(
        posts.map(post => {
          const random = Math.floor(Math.random() * 5);
          post.userId = userArray[random].id;
          return Post.create(post);
        })
      );
    })
    .catch(err => {
      console.error('Error coming from `createPostPromises` function');
      console.error(err.message);
    });
}

function createBookingPromises(userAndPostPromise) {
  return userAndPostPromise.then(([userArray, postArray]) => {
    return Promise.all(
      bookings.map(booking => {
        const random = Math.floor(Math.random() * 5);
        booking.postId = postArray[random].id;
        booking.userId = userArray[random].id;
        return Booking.create(booking);
      })
    );
  });
}

function createCategoryPromises() {
  return Promise.all(
    categories.map(category => {
      return Category.create(category);
    })
  );
}

function createAllPromises() {
  const categoryP = createCategoryPromises();
  const userP = createUserPromises();
  const postP = createPostPromises(userP);

  const userAndPostPromise = Promise.all([userP, postP]);
  const bookingP = createBookingPromises(userAndPostPromise);

  return Promise.all([categoryP, postP, bookingP]);
}
