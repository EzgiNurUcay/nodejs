
var app = require('express')();
var http = require('http').Server(app);
var port = 3000;

var io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});



http.listen(port, function () {
  console.log("server listening " + port);
});
io.on('connection', function (socket) {
  console.log("user connected");
  socket.emit('message','emitted');

  socket.on('reply', () => { console.log("reply") });
  
});


io.sockets.on('chat',function(socket){
  socket.emit('message','emitted');

  socket.on('message', function (message) {

    console.log('A client is speaking to me! They’re saying: ' + message);

}); 

io.sockets.on('message',function(socket){
  socket.emit('message','emitted');
  console.log('A client is speaking to me! They’re saying: ' + message);
}); 

})
io.sockets.on('disconnect', function () {
  console.log('user disconnected');
});


