var socket = io('http://localhost:3001');
var name = 'pyry';
var playerIndex;
var gameState;
var myTurn = false;

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

var scene = new THREE.Scene();
var raycaster = new THREE.Raycaster();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 0, 5);


var modifier = new THREE.BendModifier();

var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('.game').appendChild(renderer.domElement);

var createCard = function(card) {
  var geometry = new THREE.PlaneGeometry(1, 2, 10, 10);
  var texture = textures[card];
  var material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: texture});
  var mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.set(2, Math.PI, 0);
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
};

var dealFlop = function(cards) {
  cards.forEach(function(card, idx) {
    var currentCard = createCard(card);
    currentCard.position.set(idx - 2, 0, 0);
  });
};

var dealTurn = function(card) {
  createCard(card).position.set(1, 0, 0);
};

var dealRiver = function(card) {
  createCard(card).position.set(2, 0, 0);
};

var clearScene = function() {
  for (var i = scene.children.length - 1; i >= 0; i--) {
    scene.remove(scene.children[i]);
  }
};

var clickHandler = function(event) {
  console.log(event);
  var action = event.target.innerText;
  var amount = parseInt(document.querySelector('.amount').value, 10);
  if (myTurn) {
    socket.emit('action', action, amount);
    myTurn = false;
  }
};

document.querySelector('.bet').addEventListener('click', clickHandler);
document.querySelector('.call').addEventListener('click', clickHandler);
document.querySelector('.fold').addEventListener('click', clickHandler);

function render() {
  TWEEN.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();
