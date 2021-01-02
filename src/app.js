const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const gameCore = require('./core/gameCore');

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

io.on('connection', client => {
  gameCore.initialize(io, client);
});

server.listen(3333, () => console.log("Running..."));