var socket = io('http://localhost:3001');

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
  mesh.rotation.set(2, 0, 0);
  scene.add(mesh);
  return mesh;
};

var card1 = createCard("AH");
var card2 = createCard("AD");

var dealStartingCards = function() {
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

dealStartingCards();
dealFlop(['3C', '5C', '2H']);
dealTurn('AS');
dealRiver('8H');

function render() {
  TWEEN.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();
