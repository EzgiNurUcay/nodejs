
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);
const port = 3000;
var roomno;


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});
http.listen(port, function () {
  console.log("server listening " + port);
});
const connections = [];

io.sockets.on('connection', (socket) => {


  socket.on('select room', (data) => {
    //if (io.nsps['/'].adapter.rooms["room-" + data] && io.nsps['/'].adapter.rooms["room-" + data].length > Roomcapacity) roomno++;

    console.log("selected room id " + data);
    socket.join("room-" + data);
    io.sockets.in("room-" + data).emit('connectToRoom', { message: "You are in '" + data + "' room" });
    roomno = data;
  });




  connections.push(socket);
  console.log(' %s sockets is connected', connections.length);


  socket.on('sending message', (message) => {
    console.log('Message is " %s " received from %s:', message, roomno);
    io.sockets.in("room-" + roomno).emit('new message', { message: message });
  });

  socket.on('broadcast', (message) => {
    socket.broadcast.emit('broadcastMessage', { message: 'hi everyone online client count is' + connections.length });
  });



  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1);
  });

});
