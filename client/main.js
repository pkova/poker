var scene = new THREE.Scene();
var cameraPosition = new THREE.Vector3(0, 0, 5);
var raycaster = new THREE.Raycaster();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(cameraPosition);


var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var createCard = function(pos) {
  var geometry = new THREE.PlaneGeometry(1, 2);
  var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  material.side = THREE.Doubleside;
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
};
