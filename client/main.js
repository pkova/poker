var socket = io('http://localhost:3001');
var name = 'pyry';
var playerIndex;
var gameState;
var myTurn = false;
var cardHover = false;

var holeCards = [];

socket.emit('join', name);

socket.on('newHand', function(state) {
  console.log('received newHand gameState: ', state);
  gameState = state;
  document.querySelector('.pot > span').innerText = state.pot;
  document.querySelector('.chips > span').innerText = state.players[playerIndex].chips;
  document.querySelector('.mybet > span').innerText = state.bets[playerIndex];
  var hisBet = state.bets.filter(function(e, i) {return i !== playerIndex;})[0];
  document.querySelector('.hisbet > span').innerText = hisBet;

  if (gameState.currentPlayer === playerIndex) {
    myTurn = true;
    document.querySelector('.turn > span').innerText = 'TRUE';
  }
});

socket.on('playerIndex', function(index) {
  playerIndex = index;
});

socket.on('cards', function(cards) {
  clearScene();
  dealStartingCards(cards[0], cards[1]);
});

socket.on('deal', function(board) {
  if (board.length === 3) {
    dealFlop(board);
  } else if (board.length === 4) {
    dealTurn(R.last(board));
  } else if (board.length === 5) {
    dealRiver(R.last(board));
  }
});

socket.on('showdown', function(winners) {
  console.log('received winners data', winners);
  var message;
  if (winners.length > 1) {
    message = 'Split pot! Both players win ' + winners[0].amount + ' chips with ' + winners[0].hand.message + '!';
  } else {
    message = winners[0].playerName + ' wins ' + winners[0].amount + ' chips with ' + winners[0].hand.message + '!';
  }
  document.querySelector('.winmessage').innerText = message;
  document.querySelector('.winmessage').style.visibility = 'visible';

  // Fade out element
  var s = document.querySelector('.winmessage').style;
  s.opacity = 1;
  (function fade(){(s.opacity-=.1)<0?s.display="none":setTimeout(fade, 500)})();

});

var scene = new THREE.Scene();
var raycaster = new THREE.Raycaster();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 0, 5);

var modifier = new THREE.BendModifier();

var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('.game').appendChild(renderer.domElement);

var createCard = function(card) {

  var textureFront = textures[card];
  var textureBack = textures['back'];
  var materials = [new THREE.MeshBasicMaterial({map: textureFront, side: THREE.FrontSide}),
                   new THREE.MeshBasicMaterial({map: textureBack, side: THREE.BackSide})];


  var geometry = new THREE.PlaneGeometry(1, 2);

  for (var i = 0, len = geometry.faces.length; i < len; i++) {
    var face = geometry.faces[i].clone();
    face.materialIndex = 1;
    geometry.faces.push(face);
    geometry.faceVertexUvs[0].push(geometry.faceVertexUvs[0][i].slice(0));
  }

  var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
  mesh.rotation.set(2, 0, 0);

  // DoubleSide needed for object picking to work on both sides
  mesh.material.side = THREE.DoubleSide;
  scene.add(mesh);
  return mesh;
};


var dealStartingCards = function(c1, c2) {

  clearScene();

  var card1 = createCard(c1);
  var card2 = createCard(c2);

  var coords = { x: 1, y: 2 };
  var tween = new TWEEN.Tween(coords)
      .to({ x: -0.5, y: -3 }, 1100)
      .start();

  var coords2 = { x: 1, y: 2 };
  var tween2 = new TWEEN.Tween(coords2)
    .to({ x: 0.5, y: -3 }, 1100)
    .start();

  tween.onUpdate( function() {
    card1.position.set(coords.x, coords.y, 0);
    card1.rotation.set(card1.rotation.x, card1.rotation.y, card1.rotation.z + 0.1);

    card2.position.set(coords2.x, coords2.y, 0);
    card2.rotation.set(card2.rotation.x, card2.rotation.y, card2.rotation.z + 0.1);
  });

  holeCards = [card1, card2];
};

var dealFlop = function(cards) {
  cards.forEach(function(card, idx) {
    var currentCard = createCard(card);
    var tween = new TWEEN.Tween(currentCard.rotation).to({x: currentCard.rotation.x, y: currentCard.rotation.y + Math.PI, z: currentCard.rotation.z}, 500).start();
    currentCard.position.set(idx - 2, 0, 0);
  });
};

var dealTurn = function(card) {
  var currentCard = createCard(card);
  currentCard.position.set(1, 0, 0);
  var tween = new TWEEN.Tween(currentCard.rotation).to({x: currentCard.rotation.x, y: currentCard.rotation.y + Math.PI, z: currentCard.rotation.z}, 500).start();
};

var dealRiver = function(card) {
  var currentCard = createCard(card);
  currentCard.position.set(2, 0, 0);
  var tween = new TWEEN.Tween(currentCard.rotation).to({x: currentCard.rotation.x, y: currentCard.rotation.y + Math.PI, z: currentCard.rotation.z}, 500).start();
};

var clearScene = function() {
  for (var i = scene.children.length - 1; i >= 0; i--) {
    scene.remove(scene.children[i]);
  }
};

var clickHandler = function(event) {
  var action = event.target.innerText;
  var amount = parseInt(document.querySelector('.amount').value, 10);
  if (myTurn) {
    socket.emit('action', action, amount);
    myTurn = false;
    document.querySelector('.turn > span').innerText = 'FALSE';
  }
};

var hoverHandler = function(event) {
  event.preventDefault();
  var mouse = new THREE.Vector2();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects(holeCards);

  if (intersects.length > 0 && !cardHover) {
    holeCards.forEach(function(obj) {
      obj.rotateX(Math.PI);
    });
    cardHover = true;
  } else if (intersects.length === 0 && cardHover) {
    holeCards.forEach(function(obj) {
      obj.rotateX(Math.PI);
    });
    cardHover = false;
  }
};

document.querySelector('.bet').addEventListener('click', clickHandler);
document.querySelector('.call').addEventListener('click', clickHandler);
document.querySelector('.fold').addEventListener('click', clickHandler);
document.querySelector('canvas').addEventListener('mousemove', hoverHandler);

function render() {
  TWEEN.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  scene.updateMatrixWorld();
}
render();
