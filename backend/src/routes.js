const { Router } = require('express');
const UserController = require('./controllers/UserController');
const ArtistController = require('./controllers/ArtistController');
const SearchController = require('./controllers/SearchController');
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://1ec10c9cc93b4b12833408f0982fd197@sentry.io/1883645' });

const routes = Router();

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason)
  // Recommended: send the information to sentry.io
  // or whatever crash reporting service you use
})

routes.get('/users', UserController.index);
routes.get('/artists', ArtistController.index);
routes.get('/search', SearchController.index);

routes.post('/users', UserController.store);
routes.post('/artists', ArtistController.store);

module.exports = routes;
