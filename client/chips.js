window.blueChip;
window.redChip;
window.whiteChip;
window.blackChip;
window.yellowChip;

var loader = new THREE.ColladaLoader();

var light = new THREE.AmbientLight( 0x404040, 3); // soft white light
scene.add( light );

loader.load('blue_chip.dae', function(model) {
  window.blueChip = model.scene;
});

loader.load('black_chip.dae', function(model) {
  window.blackChip = model.scene;
});

loader.load('red_chip.dae', function(model) {
  window.redChip = model.scene;
});

loader.load('white_chip.dae', function(model) {
  window.whiteChip = model.scene;
});

loader.load('yellow_chip.dae', function(model) {
  window.yellowChip = model.scene;
});
