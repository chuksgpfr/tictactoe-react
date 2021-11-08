// import checkWinning from "./checkWin";
const checkWinning = require("./checkWin");

const roomDetails = {
  moves: JSON.stringify({0:"X",1:"X",6:"X",7:"O",8:"X"})
}
const dd = checkWinning("A", roomDetails);

console.log(dd);