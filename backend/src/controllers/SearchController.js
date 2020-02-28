const Artists = require('../models/Artist');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
  async index(request, response) {
    const { latitude, longitude, art_type } = request.query;
    
    const art_typeArray = parseStringAsArray(art_type);

    const artists = await Artists.find({
      art_type: {
        $in: art_typeArray,
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000,
        },
      },
    });

    return response.json({ artists: [] });
  }
}