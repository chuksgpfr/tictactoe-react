const checkWinning = (symbol, moves) => {
  // const moves = JSON.parse(roomDetails.moves);
  const winningways = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  const staticMoves = ["A","B","C","D","E","F","G","H","I"];
  // check if moves is >= 5
  if (Object.entries(moves).length < 4) {
    return "play";
  }

  // sort moves
  const sortedMoves = Object.keys(moves).sort().reduce((obj, key) => {
    console.log("Key", key);
    staticMoves[key] = moves[key];
    return staticMoves;
  }, {})

  console.log("Sorted ", sortedMoves);

  const movesArr = Object.values(sortedMoves);
  let won = false;

  winningways.some(ways => {
    const isPoint = ways.map(x => movesArr[x])

    const allEqual = isPoint.every(val => val === isPoint[0]);

    if(allEqual) {
      won = true;
      return true;
    }
  });

  if (Object.entries(moves).length === 9 && !won) {
    return "draw";
  }

  if(won) {
    return "won"
  } else {
    return "play"
  }

}

// export default  checkWinning;

export default checkWinning;
