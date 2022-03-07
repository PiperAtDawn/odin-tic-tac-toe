const players = (() => {
  const symbols = {
    1: "X",
    2: "O"
  };

  const names = {
    1: "",
    2: ""
  };

  let currentPlayer = 1;

  const getCurrentSymbol = () => {
    return symbols[currentPlayer];
  };

  const getCurrentName = () => {
    return names[currentPlayer];
  }

  const switchPlayer = () => {
    currentPlayer = 3 - currentPlayer;
  }

  const setName = (playerNum, name) => {
    names[playerNum] = name;
  }

  const reset = () => {
    currentPlayer = 1;
  }

  return {
    currentPlayer,
    getCurrentSymbol,
    getCurrentName,
    setName,
    reset,
    switchPlayer
  }
})();

const gameBoard = (() => {
  const div = document.querySelector(".gameboard");

  let cells = [];
  let values = [];
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
  ];

  const init = () => {
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.player = "";
      cell.dataset.index = i;
      cell.id = `cell${i}`;
      cells.push(cell);
      values.push("");
      div.appendChild(cell);
    }
  };

  const isLineSame = line => {
    for (let i = 0; i < line.length - 1; i++) {
      if (line[i] !== line[i + 1] || line[i] === "") return false;
    };
    return true;
  }

  const checkWinner = () => {
    let isWinner = false;
    winningCombos.forEach(combo => {
      let line = [values[combo[0]], values[combo[1]], values[combo[2]]];
      if (isLineSame(line)) {
        isWinner = true;
        return;
      };
    });
    return isWinner;
  };

  const reset = () => {
    cells.length = 0;
    values.length = 0;
    div.innerHTML = "";
    init();
  }

  return {
    div,
    cells,
    values,
    checkWinner,
    reset,
    init
  };
})();

const Game = (() => {
  const maxRound = 8;
  let round = 0;
  gameBoard.init();
  let cells = gameBoard.cells;
  let values = gameBoard.values;
  const victoryMessage = document.querySelector(".victory-message");
  const resetBtn = document.querySelector("#reset");

  const verifyCell = e => {
    if (e.target.dataset.player == "") {
      return true;
    }
    else return false;
  }

  const putSymbol = e => {
    const symbol = players.getCurrentSymbol();
    e.target.textContent = symbol;
    e.target.dataset.player = players.currentPlayer;
    const index = e.target.dataset.index;
    values[index] = symbol;
  }

  const play = e => {
    if (!verifyCell(e)) return;
    putSymbol(e);
    if (gameBoard.checkWinner()) {
      victoryMessage.textContent = `${players.getCurrentName()} wins!`;
      endGame();
    } else {
      if (round == maxRound) {
        victoryMessage.textContent = "It's a tie!";
        endGame();
      }
    }
    players.switchPlayer();
    round++;
  };

  const endGame = () => {
    cells.forEach(cell => {
      cell.classList.add("unclickable");
    })
  }

  const addCellEvents = () => {
    cells.forEach(cell => {
      cell.addEventListener("click", play)
    });
  };

  addCellEvents();

  const reset = () => {
    round = 0;
    victoryMessage.textContent = "";
    gameBoard.reset();
    players.reset();
    cells = gameBoard.cells;
    values = gameBoard.values;
    addCellEvents();
  }

  resetBtn.addEventListener("click", reset);

})();

const modal = (() => {
  const modalEl = document.querySelector(".modal");
  const form = document.querySelector("form");

  const hideModal = () => {
    modalEl.classList.add("hide");
  };

  form.addEventListener("submit", e => {
    e.preventDefault();
    players.setName(1, form.player1.value);
    players.setName(2, form.player2.value);
    hideModal();
  });
})();