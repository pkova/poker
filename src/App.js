import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      betButton: 'Raise',
      callButton: 'Call'
    };
  }

  render() {
    return (
      <div className="game">
        <div className="video"></div>
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
