const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
const connections = [];

exports.setupWebSocket = (server) => {
  io = socketio(server);

  io.on('connection', socket => {
    const { latitude, longitude, art_types } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      art_types: parseStringAsArray(art_types),
    });
  }); 
};

exports.findConnections = (coordinates, art_types) => {
  return connections.filter(connection => {
    return calculateDistance(coordinates, connection.coordinates) < 10
      && connection.art_types.some(item => art_types.includes(item))
  })
}

exports.sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  })
}