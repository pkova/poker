var roomName = window.location.hash.split('#')[1];
console.log(roomName);
var webrtc = new SimpleWebRTC({
  localVideoEl: 'video2',
  // the id/element dom element that will hold remote videos
  remoteVideosEl: 'video',
  // immediately ask for camera access
  autoRequestMedia: true,
  url: window.location.href
});

// we have to wait until it's ready
webrtc.on('readyToCall', function () {
  // you can name it anything
  webrtc.joinRoom(roomName);
});
