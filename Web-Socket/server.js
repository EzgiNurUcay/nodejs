
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
  connections.push(socket);
  console.log(' %s sockets is connected', connections.length);
  
  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1);
  });

  socket.on('sending message', (message) => {
    console.log('Message is received :', message);
    io.sockets.emit('new message', { message: message });
  });

socket.on('broadcast',(message)=>{
  socket.broadcast.emit('broadcastMessage', { message: 'hi everyone online client count is' + connections.length });
});
 

});
