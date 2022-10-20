const express = require('express');
const http = require('http');
const socket = require('socket.io');
const cors = require('cors');
const RoomRouter = require('./router/index');

require('dotenv').config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200,
}));
app.use('/api/room', RoomRouter);

const server = http.Server(app);
const io = socket(server);
const PORT = process.env.PORT_SERVER || 1234;

io.on('connection',socket => {
    const members = new Array(12).fill([]);
  const roomStatuses = new Array(12).fill(true);

  socket.on('REQUEST_MEMBERS', () => {
    io.emit('GET_MEMBERS', members);
  });

  socket.on('ADD_MEMBER', data => {
    members[data] = [...members[data], socket.id];
    io.emit('GET_MEMBERS', members);
  });

  socket.on('REMOVE_MEMBER', data => {
    let removed = false;
    if (~members[data].indexOf(socket.id)) {
        members[data].splice(members[data].indexOf(socket.id), 1);
        removed = true;
    }
    io.emit('GET_MEMBERS', members);
    if (removed) {
        io.emit('REMOVED', true);
    }
  });

  socket.on('SET_ITEMS', data => {
    io.emit('GET_ITEMS', data);
  });

  socket.on('SET_FLIPPED', data => {
      io.emit('GET_FLIPPED', data);
  });

  socket.on('SET_ROOM_STATUSES', data => {
      roomStatuses[data.room] = data.status;
      io.emit('GET_ROOM_STATUSES', roomStatuses);
  });
  
  socket.on('REQUEST_ROOM_STATUSES', () => {
      io.emit('GET_ROOM_STATUSES', roomStatuses);
  });
});
server.listen(PORT, console.log('✅ Server running...'));



