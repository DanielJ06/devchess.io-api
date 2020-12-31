let io;
let gameSocket;
let gamesInSession = [];

const initialize = (socketio, socket) => {
  io = socketio;
  gameSocket = socket;

  gamesInSession.push(gameSocket);

  gameSocket.on("disconnect", onDisconnect)
  gameSocket.on("createNewGame", createNewGame)
}

const onDisconnect = () => {
  let i = gamesInSession.indexOf(gameSocket);
  gamesInSession.splice(i, 1);
}

const createNewGame = (gameId) => {
  this.emit('createNewGame', { gameId: gameId, mySocketId: this.id })
  this.join(gameId)
}

exports.initialize = initialize;