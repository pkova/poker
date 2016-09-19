var express = require('express');
var app = express();

var sockets = require('signal-master/sockets');

app.use(express.static('client'));

var server = app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});

sockets(server,{
  "isDev": true,
  "server": {
    "port": 8888,
    "/* secure */": "/* whether this connects via https */",
    "secure": false,
    "key": null,
    "cert": null,
    "password": null
  },
  "rooms": {
    "/* maxClients */": "/* maximum number of clients per room. 0 = no limit */",
    "maxClients": 0
  },
  "stunservers": [
    {
      "url": "stun:stun.l.google.com:19302"
    }
  ],
  "turnservers": [
    {
      "urls": ["turn:your.turn.servers.here"],
      "secret": "turnserversharedsecret",
      "expiry": 86400
    }
  ]
});
