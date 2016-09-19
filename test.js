var poker = require('./lib/node-poker');

var table = new poker.Table(50,100,4,10,100,1000);

table.AddPlayer('pyry',1000);
table.AddPlayer('billy',1000);

table.StartGame();

console.log(table.players[table.dealer].playerName);
console.log(table.players[table.currentPlayer].playerName);

table.players[table.currentPlayer].Call();
table.players[table.currentPlayer].Call();

console.log(table.players[table.dealer].playerName);
console.log(table.players[table.currentPlayer].playerName);

