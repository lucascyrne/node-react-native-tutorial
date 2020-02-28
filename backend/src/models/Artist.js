const mongoose = require('mongoose');
const PointSchema = require('./utils/PointSchema');

const ArtistSchema = new mongoose.Schema({
  name: String,
  appUsername: String,
  github_username: String,
  bio: String,
  avatar_url: String,
  art_type: [String],
  location: {
    type: PointSchema,
    index: '2dsphere'
  },
});

module.exports = mongoose.model('Artist', ArtistSchema);