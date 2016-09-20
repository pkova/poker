var poker = require('./lib/node-poker');

var table = new poker.Table(50,100,4,10,100,1000);

table.AddPlayer('pyry',1000);
table.AddPlayer('billy',1000);

table.StartGame();
console.log(table.players);

table.players[table.currentPlayer].Fold();
table.initNewRound();
console.log(table.players);
