import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const boardSize = 15;
  let board = [];
  for (let i = 0; i < boardSize; i++) {
    let row = [];
    for (let j = 0; j < boardSize; j++) {
      row.push(
        <Square
          key={`${i}-${j}`}
          value={squares[i * boardSize + j]}
          onSquareClick={() => handleClick(i * boardSize + j)}
        />
      );
    }
    board.push(<div key={i} className="board-row">{row}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(15 * 15).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const boardSize = 15;
  const directions = [
    [1, 0], [0, 1], [1, 1], [1, -1]
  ];

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const player = squares[i * boardSize + j];
      if (player) {
        for (let [dx, dy] of directions) {
          let count = 1;
          for (let k = 1; k < 5; k++) {
            const x = i + k * dx;
            const y = j + k * dy;
            if (x >= 0 && x < boardSize && y >= 0 && y < boardSize && squares[x * boardSize + y] === player) {
              count++;
            } else {
              break;
            }
          }
          for (let k = 1; k < 5; k++) {
            const x = i - k * dx;
            const y = j - k * dy;
            if (x >= 0 && x < boardSize && y >= 0 && y < boardSize && squares[x * boardSize + y] === player) {
              count++;
            } else {
              break;
            }
          }
          if (count >= 5) {
            return player;
          }
        }
      }
    }
  }
  return null;
}