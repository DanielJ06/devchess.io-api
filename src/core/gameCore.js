let io;
let gameSocket;
let gamesInSession = [];
let users = []

function initialize(socketio, socket) {
  io = socketio;
  gameSocket = socket;

  gamesInSession.push(gameSocket);

  gameSocket.on("disconnect", onDisconnect)
  gameSocket.on("createNewGame", createNewGame)
  gameSocket.on("playerJoinGame", playerJoinGame);
}

function onDisconnect() {
  let i = gamesInSession.indexOf(gameSocket);
  gamesInSession.splice(i, 1);
}

function createNewGame(data) {
  const user = {
    username: data.username,
    color: 'w'
  }
  users.push(user);
  console.log('Game host:', users);
  this.join(data.gameId)
}

function playerJoinGame(id) {
  console.log(id.gameId);
  let socket = this;
  let room = io.sockets.adapter.rooms[id.gameId];

  if(room === undefined) {
    this.emit('status', 'This game session does not exists!');
    return
  }

  if(room.length < 2) {
    id.mySocketId = socket.id;

    socket.join(id.gameId);
    const user = {
      username: id.username,
      color: 'b'
    }
    users.push(user);
    console.log('Join a game: ', users)

    if (room.length === 2) {
      io.sockets.in(id.gameId).emit('start', id.username);
    }

    io.sockets.in(id.gameId).emit('playerJoinedRoom', id);
  } else {
    this.emit('status', 'There are already 2 players playing in this room')
  }
}

exports.initialize = initialize;