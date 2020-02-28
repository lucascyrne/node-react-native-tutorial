// O Node.js "compila" de forma síncrona e linear; 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const routes = require('./routes');
const { setupWebSocket } = require('./websocket')

const app = express();
const server = http.Server(app);

setupWebSocket(server);

mongoose.connect('mongodb+srv://admin:3FJwgfNxi1VDO9in@cluster0-w33zr.mongodb.net/database?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MÉTODOS DE HTTP: GET, POST, PUT, DELETE

// Tipos de parâmetros:

// Query Params: request.query (Filtros, ordenação, paginação...)
// Route Params: request.params (Indentificar um recurso na alteração ou remoção)
// Body: request.body (Dados para criação ou alteração de um registro)

// Esta aplicação utiliza MongoDB
app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);

