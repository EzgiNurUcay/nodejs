var app = require('express')();
var http = require('http').Server(app);

var port=3030;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});
var io=require('socket.io')(http);
io.on('connection',function(socket){
    console.log("connected");
})
http.listen(port, function(){
  console.log('listening on *:'+port);
});


