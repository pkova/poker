import React, { Component } from 'react';
import React3 from 'react-three-renderer';
import THREE from 'three';
import TWEEN from 'tween.js';

class Video extends React.Component {
  constructor(props, context) {
    super(props, context);

    var coords = { x: 1, y: 2 };
    var tween = new TWEEN.Tween(coords)
                         .to({ x: -1, y: -1 }, 1250)
                         .onUpdate(function() {
                           console.log(this.x, this.y);
                         })
                         .start();

    var coords2 = { x: 1, y: 2 };
    var tween2 = new TWEEN.Tween(coords2)
                         .to({ x: 1, y: -1 }, 1000)
                         .onUpdate(function() {
                           console.log(this.x, this.y);
                         })
                         .start();


    tween.onUpdate( () => {
      console.log('hello');
      this.setState({
        card1Position: new THREE.Vector3(coords.x, coords.y, 0),
        card2Position: new THREE.Vector3(coords2.x, coords2.y, 0),
        cardRotation: new THREE.Euler(
          2,
          this.state.cardRotation.y,
          this.state.cardRotation.z + 0.1
        )
      });
    });




    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.
    this.cameraPosition = new THREE.Vector3(0, 0, 5);

    this.state = {
      card1Position: new THREE.Vector3(0, 0, 0),
      card2Position: new THREE.Vector3(0, 0, 0),
      cardRotation: new THREE.Euler(2, 0, 0)
    };

  }

  _onAnimate = () => {
    // we will get this callback every frame

    // pretend cardRotation is immutable.
    // this helps with updates and pure rendering.
    // React will be sure that the rotation has now updated.
    TWEEN.update();
  };

  render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

    return (
      <React3
      mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
      width={width}
      height={height}

      onAnimate={this._onAnimate}
      alpha={true}
    >
      <scene>
        <perspectiveCamera
          name="camera"
          fov={75}
          aspect={width / height}
          near={0.1}
          far={1000}

          position={this.cameraPosition}
        />
        <mesh
          rotation={this.state.cardRotation}
          position={this.state.card1Position}
        >
          <planeGeometry
            width={1}
            height={2}
          />
          <meshBasicMaterial
            color={0x00ff00}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh
          rotation={this.state.cardRotation}
          position={this.state.card2Position}
        >
          <planeGeometry
            width={1}
            height={2}
          />
          <meshBasicMaterial
            color={0x00ff00}
            side={THREE.DoubleSide}
          />
        </mesh>
      </scene>
    </React3>);
  }
}

export default Video;
