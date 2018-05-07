const { db, Booking, Category, Post, User } = require('./index');

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
    imageUrl: '',
    title: 'Parking for Disney',
    description: 'You can park here if you really want to',
    price: 5,
  },
  {
    imageUrl: '',
    title: 'Parking for Disney',
    description: 'You can park here if you really want to',
    price: 5,
  },
  {
    imageUrl: '',
    title: 'Parking for Disney',
    description: 'You can park here if you really want to',
    price: 5,
  },
  {
    imageUrl: '',
    title: 'Parking for Disney',
    description: 'You can park here if you really want to',
    price: 5,
  },
  {
    imageUrl: '',
    title: 'Parking for Disney',
    description: 'You can park here if you really want to',
    price: 5,
  },
];

db
  .sync({ force: true })
  .then(() => {
    const usersP = users.map(user => {
      return User.create(user);
    });
    return Promise.all(usersP);
  })
  .then(userArray => {
    const postsP = posts.map(post => {
      const random = Math.floor(Math.random() * 5);
      post.userId = userArray[random].id;
      return Post.create(post);
    });
    return Promise.all(postsP);
  })
  .then(postArray => {
    const bookingsP = bookings.map(booking => {
      const random = Math.floor(Math.random() * 5);
      const post = postArray[random];
      booking.postId = post.id;
      booking.userId = random + 1;
      return Booking.create(booking);
    });
  })
  .catch(err => {
    console.error(err);
    db.close();
  });
