var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var poker = require('./lib/node-poker');
var R = require('ramda');

var table = new poker.Table(5, 10, 2, 2, 100, 1000);

var emitter = table.getEventEmitter();

var players = [];

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('join', function(name) {
    table.AddPlayer(name, 1000);

    players.push({
      name: name,
      socket: socket
    });

    var playerIndex = players.findIndex(function(e) {
      return e.socket === socket;
    });
    socket.playerIndex = playerIndex;

    socket.emit('playerIndex', playerIndex);

    if (table.players.length === 2) {
      var getClientState = R.compose(R.assoc('currentPlayer', table.currentPlayer),
                                     R.assoc('players',
                                             R.map(
                                               R.pickAll(['playerName', 'chips']),
                                                   table.players)),
                                     R.dissoc('deck'),
                                     R.clone);

      var gameState = getClientState(table.game);

      table.players.forEach(function(player, i) {
        var s = players[i].socket;
        s.emit('cards', player.cards);
      });

      console.log('emitting newHand');
      io.emit('newHand', gameState);

    }
  });

  socket.on('action', function(action, amount) {

    if (socket.playerIndex === table.currentPlayer) {
      if (action === 'Bet') {
        table.players[table.currentPlayer].Bet(amount);
        var getClientState = R.compose(R.assoc('currentPlayer', table.currentPlayer),
                                       R.assoc('players',
                                               R.map(
                                                 R.pickAll(['playerName', 'chips']),
                                                 table.players)),
                                       R.dissoc('deck'),
                                       R.clone);


        console.log(table.currentPlayer);
        console.log(table.currentPlayer);
        console.log('emitting newHand BET');
        var gameState = getClientState(table.game);
        io.emit('newHand', gameState);
      } else if (action === 'Call') {
        table.players[table.currentPlayer].Call();

        var getClientState = R.compose(R.assoc('currentPlayer', table.currentPlayer),
                                       R.assoc('players',
                                               R.map(
                                                 R.pickAll(['playerName', 'chips']),
                                                 table.players)),
                                       R.dissoc('deck'),
                                       R.clone);

        var gameState = getClientState(table.game);

        console.log('emitting newHand CALL');
        io.emit('newHand', gameState);

      } else if (action === 'Fold') {
        table.players[table.currentPlayer].Fold();

        var getClientState = R.compose(R.assoc('currentPlayer', table.currentPlayer),
                                       R.assoc('players',
                                               R.map(
                                                 R.pickAll(['playerName', 'chips']),
                                                 table.players)),
                                       R.dissoc('deck'),
                                       R.clone);

        var gameState = getClientState(table.game);

        console.log('emitting newHand FOLD');
        io.emit('newHand', gameState);
      }
    }
  });


  socket.on('disconnect', function() {
    console.log('a user has disconnected');
    players = players.filter(function(e) {
      return e.socket !== socket;
    });
    var table = new poker.Table(5, 10, 2, 2, 100, 1000);
  });

});

http.listen(3001, function(){
  console.log('listening on *:3001');
});

emitter.on('deal', function() {
  console.log('deal');
  io.emit('deal', table.game.board);
});

emitter.on('newRound', function() {
  console.log('newRound');
  table.players.forEach(function(player, i) {
    if (players[i]) {
      var s = players[i].socket;
      s.emit('cards', player.cards);
    }
  });
});

emitter.on('showdown', function() {
  console.log('SHOWDOWN');
  io.emit('showdown', table.gameWinners);
});
