import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const createNewGameBoard = () => {
  const COLUMNS = 5;
  const ROWS = 5;
  const gameData = [];
  for (let i = 0; i <= ROWS; i += 1) {
    const newRow = [];
    for (let j = 0; j <= COLUMNS; j += 1) {
      newRow.push({ active: false });
    }
    gameData.push(newRow);
  }
  return gameData;
};

const isSquareActive = (gameBoard, row, col) => {
  if (gameBoard[row] && gameBoard[row][col] && gameBoard[row][col].active) {
    return true;
  }
  return false;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameData: createNewGameBoard()
    };
    this.activateGameSquare = this.activateGameSquare.bind(this);
    this.increaseGeneration = this.increaseGeneration.bind(this);
  }

  activateGameSquare(row, col) {
    const newGameState = [...this.state.gameData];
    newGameState[row][col] = { active: true };
    this.setState({
      gameData: newGameState
    });
  }

  increaseGeneration() {
    const currGeneration = this.state.gameData;
    const nextGeneration = createNewGameBoard();
    for (var j = 0; j < nextGeneration.length; j += 1) {
      // nextGeneration[j] will be an array of squares in the j'th row
      for (var i = 0; i < nextGeneration[j].length; i += 1) {
        // We are now looking at an individual square.
        // Count how many neighbours are active
        // currGeneration[j][i] is the current square
        let tempNumActiveNeighbours = 0;
        if (isSquareActive(currGeneration, j - 1, i - 1)) { tempNumActiveNeighbours += 1; }
        if (isSquareActive(currGeneration, j - 1, i    )) { tempNumActiveNeighbours += 1; }
        if (isSquareActive(currGeneration, j - 1, i + 1)) { tempNumActiveNeighbours += 1; }
        if (isSquareActive(currGeneration, j    , i - 1)) { tempNumActiveNeighbours += 1; }
        if (isSquareActive(currGeneration, j    , i + 1)) { tempNumActiveNeighbours += 1; }
        if (isSquareActive(currGeneration, j + 1, i - 1)) { tempNumActiveNeighbours += 1; }
        if (isSquareActive(currGeneration, j + 1, i    )) { tempNumActiveNeighbours += 1; }
        if (isSquareActive(currGeneration, j + 1, i + 1)) { tempNumActiveNeighbours += 1; }
        nextGeneration[j][i].active = currGeneration[j][i].active;
        if (tempNumActiveNeighbours >= 4) {
          nextGeneration[j][i].active = false;
        }
        if (tempNumActiveNeighbours <= 1) {
          nextGeneration[j][i].active = false;
        }
        if (tempNumActiveNeighbours === 3) {
          nextGeneration[j][i].active = true;
        }
      }
    }
    this.setState({
      gameData: nextGeneration
    });
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
          {this.state.gameData.map((row, index) =>
            <GameBoardRow
              key={index}
              gameRow={row}
              row={index}
              activateGameSquare={this.activateGameSquare}
            />)}
        </div>
        <NextGenerationButton onClick={this.increaseGeneration} />
      </div>
    );
  }
}

const GameBoardRow = ({ gameRow, row, activateGameSquare }) =>
  <div className="game-board-row">
    {gameRow.map((square, index) =>
      <GameSquare
        key={`${row},${index}`}
        square={square}
        row={row}
        col={index}
        activateGameSquare={activateGameSquare}
      />)}
  </div>;

GameBoardRow.propTypes = {
  gameRow: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      active: React.PropTypes.bool
    })
  ).isRequired,
  row: React.PropTypes.number.isRequired,
  activateGameSquare: React.PropTypes.func.isRequired
};

const GameSquare = ({ square, row, col, activateGameSquare }) =>
  <button
    className={`square ${square.active}`}
    onClick={() => activateGameSquare(row, col)}
  />;

GameSquare.propTypes = {
  square: React.PropTypes.shape({
    active: React.PropTypes.bool
  }).isRequired,
  row: React.PropTypes.number.isRequired,
  col: React.PropTypes.number.isRequired,
  activateGameSquare: React.PropTypes.func.isRequired
};

const NextGenerationButton = ({ onClick }) => (
  <button
    type="button"
    height="100px"
    width="200px"
    onClick={onClick}
  >Next Generation</button>
);
NextGenerationButton.propTypes = {
  onClick: React.PropTypes.func.isRequired
};

export default App;
