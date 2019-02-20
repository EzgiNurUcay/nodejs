
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);
const port = 3000;


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
    socket.join("room-" + data);
    io.sockets.in(Object.keys(io.sockets.adapter.sids[socket.id])[1]).emit('connectToRoom', { message: "You are in '" + data + "' room" });
    //console.log("room name is", Object.keys(io.sockets.adapter.sids[socket.id])[1]); shows room name.
  });


  connections.push(socket);
  console.log(' %s sockets is connected', connections.length);


  socket.on('sending message', (message) => {
    console.log('Message is " %s " received from %s:', message, Object.keys(io.sockets.adapter.sids[socket.id])[1]);
    io.sockets.in(Object.keys(io.sockets.adapter.sids[socket.id])[1]).emit('new message', { message: message });
  });

  socket.on('broadcast', (message) => {
    socket.broadcast.emit('broadcastMessage', { message: 'hi everyone online client count is' + connections.length });
  });



  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1);
  });

});
