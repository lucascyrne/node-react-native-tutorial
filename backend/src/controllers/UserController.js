const axios = require('axios');
const Users = require('../models/Users');

// funções gerais: index, show, store, update, destroy

module.exports = {
  async index(request, response) {
    const users = await Users.find();

      return response.json(users);
  },

  async store(request, response) {
    const { github_username, appUsername, wallet, latitude, longitude } = request.body;
  
    let user = await Users.findOne({ github_username }); // se a entidade não existir, ele cria uma nova

    if(!user)
    {
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
  
      const { name = login, avatar_url, bio } = apiResponse.data;
    
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    
      users = await Users.create({
        name,
        appUsername,
        github_username,
        bio,
        avatar_url,
        wallet,
        location
      });
    
      console.log(name, avatar_url, bio, github_username, wallet, location);
    
    }

    return response.json(users);
  },

  async update() {

  },

  async destroy() {

  }, 
};