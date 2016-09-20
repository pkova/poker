var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var poker = require('./lib/node-poker');
var R = require('ramda');

var table = new poker.Table(50, 100, 2, 2, 100, 1000);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('join', function(name) {
    table.AddPlayer(name, 1000);

    if (table.players.length === 2) {
      var getClientState = R.compose(R.assoc('currentPlayer', table.currentPlayer),
                                     R.assoc('players',
                                             R.map(
                                               R.pickAll(['playerName', 'chips']),
                                                   table.players)),
                                     R.dissoc('deck'),
                                     R.clone);
      var gameState = getClientState(table.game);
      console.log('emitting newHand');
      io.emit('newHand', gameState);
    }
  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
