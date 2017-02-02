import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const createNewGameBoard = () => {
  const COLUMNS = 50;
  const ROWS = 30;
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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameData: createNewGameBoard(),
      isRunning: true,
      generation: 0
    };
    this.randomlyPopulateGameBoard = this.randomlyPopulateGameBoard.bind(this);
    this.activateGameSquare = this.activateGameSquare.bind(this);
    this.increaseGeneration = this.increaseGeneration.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
    this.clearGameBoard = this.clearGameBoard.bind(this);
  }

  componentWillMount() {
    this.randomlyPopulateGameBoard();
    requestAnimationFrame(this.gameLoop);
  }

  randomlyPopulateGameBoard() {
    const newBoard = [...this.state.gameData];
    newBoard.forEach(row =>
      row.forEach((square) => {
        const activePercentage = 3; // A 1 in 3 change for game square to be activePercentage
        if (Math.floor(Math.random() * activePercentage) === 0) {
          square.active = true;
        }
      })
    );
    this.setState({
      gameData: newBoard
    });
  }

  clearGameBoard() {
    const newBoard = [...this.state.gameData];
    newBoard.forEach(row =>
      row.forEach(square => {
        square.active = false;
      })
    );
    this.setState({
      gameData: newBoard
    });
  }

  gameLoop() {
    if (this.state.isRunning) {
      setTimeout(() => {
        requestAnimationFrame(this.gameLoop);
        this.increaseGeneration();
      }, 1000);
    } else {
      this.setState({
        generation: 0
      });
    }
  }

  activateGameSquare(row, col) {
    const newGameState = [...this.state.gameData];
    newGameState[row][col] = { active: true };
    this.setState({
      gameData: newGameState
    });
  }

  handleStart() {
    this.setState({
      isRunning: true
    });
    requestAnimationFrame(this.gameLoop);
  }

  handleStop() {
    this.setState({
      isRunning: false,
      generation: 0
    });
  }

  increaseGeneration() {
    const nextGenerationCount = this.state.generation + 1;
    const currGeneration = this.state.gameData;
    const nextGenerationBoard = createNewGameBoard();
    let j;
    let i;
    for (j = 0; j < nextGenerationBoard.length; j += 1) {
      // nextGenerationBoard[j] will be an array of squares in the j'th row
      for (i = 0; i < nextGenerationBoard[j].length; i += 1) {
        // We are now looking at an individual square.
        // Count how many neighbours are active
        // currGeneration[j][i] is the current square
        let tempNumActiveNeighbours = 0;
        if (isSquareActive(currGeneration, j - 1, i - 1)) { tempNumActiveNeighbours += 1; }
        if (isSquareActive(currGeneration, j - 1, i)) { tempNumActiveNeighbours += 1; }
        if (isSquareActive(currGeneration, j - 1, i + 1)) { tempNumActiveNeighbours += 1; }
        if (isSquareActive(currGeneration, j, i - 1)) { tempNumActiveNeighbours += 1; }
        if (isSquareActive(currGeneration, j, i + 1)) { tempNumActiveNeighbours += 1; }
        if (isSquareActive(currGeneration, j + 1, i - 1)) { tempNumActiveNeighbours += 1; }
        if (isSquareActive(currGeneration, j + 1, i)) { tempNumActiveNeighbours += 1; }
        if (isSquareActive(currGeneration, j + 1, i + 1)) { tempNumActiveNeighbours += 1; }
        nextGenerationBoard[j][i].active = currGeneration[j][i].active;
        if (tempNumActiveNeighbours >= 4) {
          nextGenerationBoard[j][i].active = false;
        }
        if (tempNumActiveNeighbours <= 1) {
          nextGenerationBoard[j][i].active = false;
        }
        if (tempNumActiveNeighbours === 3) {
          nextGenerationBoard[j][i].active = true;
        }
      }
    }
    this.setState({
      gameData: nextGenerationBoard,
      generation: nextGenerationCount
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>The Game Of Life</h2>
        </div>
        <p className="App-intro">
          Number of Generations: {this.state.generation}
        </p>
        <div className="container">
          <div className="gameBoard">
            {this.state.gameData.map((row, index) =>
              <GameBoardRow
                key={index}
                gameRow={row}
                row={index}
                activateGameSquare={this.activateGameSquare}
              />)}
          </div>
        </div>
        <Button onClick={this.handleStart}>Start</Button>
        <Button onClick={this.handleStop}>Stop</Button>
        <Button onClick={this.clearGameBoard}>Clear</Button>
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

const Button = ({ onClick, children }) => (
  <button
    type="button"
    height="100px"
    width="200px"
    onClick={onClick}
  >{children}</button>
);
Button.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  children: React.PropTypes.node
};

export default App;
