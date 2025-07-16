const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const users = {};

let currentNumber = 1;
function playHobGame(user_input) {
  if (!isNaN(user_input) || user_input.toUpperCase() === "HOB") {
    const expected = currentNumber % 5 === 0 ? 'HOB' : currentNumber.toString();

    if (user_input.toString().toUpperCase() === expected.toUpperCase()) {
      currentNumber++;
      const server_response = currentNumber;
      currentNumber++;
      return server_response;
    } else {
      return currentNumber % 5 === 0 ? `Wrong (HOB is right)` : `Wrong (${currentNumber} is right)`;
    }
  }else if(user_input === "server_game: reset"){
    currentNumber = 1;
    return "HOB game reset to 1"
  }
  else{
    return false
  }
}

io.on('connection', (socket) => {
  const username = socket.handshake.query.username || 'Anonymous';
  users[socket.id] = username;

  console.log(`User connected:\t${username} (${socket.id})`);
  io.emit('server message', `User ${username} connected`)

  socket.on('game message', (msg) => {
    const user = users[socket.id] || 'Anonymous';
    const game_response = playHobGame(msg)
    io.emit('game message', {"username": user, "content": msg});
    if (game_response){
      io.emit('server message', game_response);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected:\t${users[socket.id]} (${socket.id})`);
    io.emit('server message', `User ${username} disconnected`)
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log('Server running on"\thttp://localhost:3000');
});



function sleep(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // do nothing
  }
}