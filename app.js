var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(8080);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/ttt', function (req, res) {
    res.sendfile(__dirname + '/ttt.html');
});

var Xs = [];
var Os = [];
var gameEnded = function(){
  if(Xs.indexOf('ul') > -1 &&
      Xs.indexOf('uc') > -1 &&
      Xs.indexOf('ur') > -1){
    return true;
  }
  return false;
}

io.sockets.on('connection', function (client) {
  client.on('messages', function (data) {
    client.broadcast.emit('messages', data);
  });
  client.on('play', function(id){
    client.broadcast.emit('played', id);
    if(Xs.length == 0){
      client.set('mark', 'X')
    } else if(Os.length == 0){
      client.set('mark', 'O')
    }
    client.get('mark', function(mark){
      if(mark == 'X'){
        Xs.push(id)
      } else if (mark == 'O'){
        Os.push(id)
      }
    });
    if(gameEnded()){
      console.log('gameEnded')
      io.sockets.emit('gameEnded', 'Ended');
    }
  });
});
