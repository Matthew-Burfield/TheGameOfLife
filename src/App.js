import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// const gameData = [
//   [{active:false},{active:false},{active:false},{active:false}],
//   [{active:false},{active:false},{active:false},{active:false}],
//   [{active:false},{active:false},{active:false},{active:false}],
//   [{active:false},{active:false},{active:false},{active:false}],
// ];
// const createGameBoard = () => {
  const COLUMNS = 5;
  const ROWS = 5;
  let gameData = [];
  for (let i = 0; i <= ROWS; i++) {
    let newRow = [];
    for (let j = 0; j <= COLUMNS; j++) {
      newRow.push({active:false});
    }
    gameData.push(newRow);
  }
// }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameData,
    };
    this.activateGameSquare = this.activateGameSquare.bind(this);
  } 
  activateGameSquare(row,col) {
    const newGameState = [...gameData];
    newGameState[row][col] = {active:true};
    this.setState({
      gameData: newGameState,
    })
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="gameBoard">
          {this.state.gameData.map((row, index) => <GameBoardRow key={index} gameRow={row} row={index} activateGameSquare={this.activateGameSquare} />)}
        </div>
      </div>
    );
  }
}

const GameBoardRow = ({gameRow, row, activateGameSquare}) =>
  <div className="game-board-row">
    {gameRow.map((square, index) => <GameSquare key={index} square={square} row={row} col={index} activateGameSquare={activateGameSquare} />)}
  </div>

const GameSquare = ({square, row, col, activateGameSquare}) => 
  <div className={`square ${square.active}`} onClick={() => activateGameSquare(row, col)}></div>

export default App;
