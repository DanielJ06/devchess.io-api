let io;
let gameSocket;
let gamesInSession = [];

const initialize = (socketio, socket) => {
  io = socketio;
  gameSocket = socket;

  gamesInSession.push(gameSocket);

  gameSocket.on("disconnect", onDisconnect)
  gameSocket.on("createNewGame", createNewGame)
  gameSocket.on("playerJoinGame")
}

const onDisconnect = () => {
  let i = gamesInSession.indexOf(gameSocket);
  gamesInSession.splice(i, 1);
}

const createNewGame = (gameId) => {
  this.emit('createNewGame', { gameId: gameId, mySocketId: this.id })
  this.join(gameId)
}

const playerJoinGame = (id) => {
  let socket = this;
  let room = io.socket.adapter.rooms[id.gameId];

  if(room === undefined) {
    this.emit('status', 'This game session does not exists!');
    return
  }

  if(room.length < 2) {
    id.mySocketId = socket.id;

    socket.join(id.gameId);

    if (room.length === 2) {
      io.socket.in(id.gameId).emit('start', id.username);
    }

    io.sockets.in(id.gameId).emit('playerJoinedRoom', id);
  } else {
    this.emit('status', 'There are already 2 players playing in this room')
  }
}

exports.initialize = initialize;