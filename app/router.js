const create = require('./routerfunctions/create')
module.exports = function(app) {
  app.get('/', (req, res) => {
    res.render('home', { title: 'User Home', username: 'Bob' });
  });

  app.get('/profile', (req, res) => {
    res.render('profile', { title: 'User Profile', username: 'Bob' });
  });

  app.post('/new/user', create.user)
}