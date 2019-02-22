
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);
const port = 3000;
var info = [];




app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});
http.listen(port, function () {
  console.log("server listening " + port);
});
const connections = [];

io.sockets.on('connection', (socket) => {


  socket.on('select room', (data) => {

    console.log("selected room id " + data);
    console.log("socket id is:" + socket.id);
    socket.join("room-" + data);
    io.sockets.in("room-" + data).emit('connect room', { message: "You are in '" + data + "' room" });
    //console.log("room name is", Object.keys(io.sockets.adapter.sids[socket.id])[1]); shows room name.


  });

  socket.on('user name defined', (data) => {

    info.push({ socketid: socket.id, username: data });
    console.log(info);
    io.sockets.in(socket.id).emit('connect user', { message: "User Name " + data });
  });


  connections.push(socket);
  console.log(' %s sockets is connected', connections.length);


  socket.on('send message', (message) => {
    //console.log("searched id is", socket.id);
    //console.log("check ", Object.keys(io.sockets.adapter.sids[socket.id]));
    //console.log("match", info.find(o => o.socketid === socket.id));
    for (let i = 0; i < info.length; i++) {
      if (info[i].socketid != socket.id) {
        if (Object.keys(io.sockets.adapter.sids[socket.id])[1] === Object.keys(io.sockets.adapter.sids[info[i].socketid])[1]) {
          io.sockets.in(info[i].socketid, Object.keys(io.sockets.adapter.sids[socket.id])[1]).emit('incomming message', { message: info.find(o => o.socketid === socket.id).username + " says: " + message });
        }
      }
    }


    io.sockets.in(socket.id).emit('outgoing message', { message: info.find(o => o.socketid === socket.id).username + " says: " + message });
  });

  socket.on('broadcast', (message) => {
    console.log("socket id is:" + socket.id);
    socket.broadcast.emit('broadcastMessage', { message: 'hi everyone online client count is' + connections.length });


  });



  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1);
  });

});
