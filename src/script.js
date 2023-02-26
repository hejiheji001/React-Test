const Square = (props) => {
  return (
    <button className={props.style} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  render() {
    const tiles = this.props.tiles;
    for (let i = 0; i < 9; i++) {
      tiles[i] = (
        <Square 
          style={this.props.styles[i]}
          key={i}
          value={this.props.squares[i]} 
          onClick={() => this.props.onClick(i)}
          />
      );
    }
    
    const rows = Array(3);
    for (let j = 0; j < 3; j++) {
      rows[j] = (
        <div className="board-row" key={j}>
          {tiles.slice(j * 3, j * 3 + 3)}
        </div>
      );
    };
    
    return (
      <div>
        <div className="status">{status}</div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          position: Array(2).fill(null),
        }
      ],
      xIsNext: true,
      stepNumber: 0,
      tiles: Array(9),
      tileStyles: Array(9).fill('square'),
      historyStyles: Array(9),
    }
  }
  
  jumpTo = (step) => {
    const historyStyles = this.state.historyStyles.slice();
    historyStyles.fill(null);
    historyStyles[step] = 'bold';
    
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      tileStyles: Array(9).fill('square'),
      historyStyles: historyStyles,
    });
  }
  
  handleClick = (i) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let position = current.position.slice();
    let winner = calculateWinner(squares);
    
    if (winner || squares[i]) {
      return;
    }
    
    position = [i % 3 + 1, Math.floor(i/3) + 1];
    
    const xIsNext = this.state.xIsNext;
    squares[i] = xIsNext ? 'X' : 'O';
    
    winner = calculateWinner(squares);
    const tileStyles = this.state.tileStyles.slice();
    
    if(winner) {
      const [player, a, b, c] = winner;
      tileStyles[a] = 'square highlight';
      tileStyles[b] = 'square highlight';
      tileStyles[c] = 'square highlight';
    }
    
    const historyStyles = this.state.historyStyles.slice();
    historyStyles.fill(null);
    historyStyles[this.state.stepNumber + 1] = 'bold';
    
    this.setState({
      history: history.concat([
        {
          squares: squares,
          position: position,
        }
      ]), 
      stepNumber: history.length,
      xIsNext: !xIsNext,
      tileStyles: tileStyles,
      historyStyles: historyStyles,
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const entries = current.squares.filter(s => s == null).length;
    const status = winner ? `Winner is ${winner[0]}` : entries > 0 ? `Next player: ${this.state.xIsNext ? 'X' : 'O'}` : 'Draw Game';
    
    const moves = history.map((step, move) => {
      const position = history[move].position;
      const desc = move ? `Go to move #${move} @position: ${[position[0], position[1]]}` : 'Go to game start';
      return (
        <li key={move}>
          <button className={this.state.historyStyles[move]} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            tiles={this.state.tiles}
            squares={current.squares}
            styles={this.state.tileStyles}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], a, b, c];
      }
    }
    return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
