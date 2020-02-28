import socketio from 'socket.io-client';

const socket = socketio('http://192.168.0.32:3333', {
  autoConnect: false,
});

function subscribeToNewArtists(subscribeFunction) {
  socket.on('new-artist', subscribeFunction);
}

function connect(latitude, longitude, art_types) { 
  socket.io.opts.query = {
    latitude, 
    longitude,
    art_types
  }

  socket.connect();
}

function disconnect() {
  if (socket.connected) {
    socket.disconnect();
  }
}

export {
  connect,
  disconnect,
  subscribeToNewArtists
};