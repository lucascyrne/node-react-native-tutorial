const axios = require('axios');
const Artist = require('../models/Artist');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');


// funções gerais: index, show, store, update, destroy

module.exports = {
  async index(request, response) {
    const artists = await Artist.find();

    return response.json(artists);
  },

  async store(request, response) {
    const { github_username, appUsername, art_type, latitude, longitude } = request.body;
  
    let artist = await Artist.findOne({ github_username }); // se a entidade não existir, ele cria uma nova

    if(!artist)
    {
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
  
      const { name = login, avatar_url, bio } = apiResponse.data;
    
      const art_typeArray = parseStringAsArray(art_type);

      const location = {
        type:'Point',
        coordinates: [longitude, latitude],
      };
    
      artist = await Artist.create({
        name,
        appUsername,
        github_username,
        bio,
        avatar_url,
        art_type: art_typeArray,
        location
      });

      // Filtrar as conexões que estão há 10km
      // e que possuem as tecnologias filtradas

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        art_typesArray,
      )

      sendMessage(sendSocketMessageTo, 'new-artist', artist);
    }
    
    return response.json(artist);
  },

  async update() {

  },

  async destroy() {

  },
};