import React, { Component } from 'react';
import Video from './Video.js';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      betButton: 'Raise',
      callButton: 'Call',
      gameState: {}
    };
  }

  render() {
    return (
      <div className="game">
        <div className="video">
          <Video gameState={this.state.gameState} />
        </div>
        <div className="controls">
          <button className="bet">{this.state.betButton}</button>
          <button className="call">{this.state.callButton}</button>
          <button className="fold">Fold</button>
        </div>
      </div>
    );
  }
}

export default App;
