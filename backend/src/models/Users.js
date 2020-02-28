const mongoose = require('mongoose');
const PointSchema = require('./utils/PointSchema');

const UserSchema = new mongoose.Schema({
  name: String,
  appUsername: String,
  github_username: String,
  bio: String,
  avatar_url: String,
  wallet: Number,
  location: {
    type: PointSchema,
    index: '2dsphere'
  },
});

module.exports = mongoose.model('Users', UserSchema);
