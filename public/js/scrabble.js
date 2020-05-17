const container = document.getElementById("con");
const trayContainer = document.getElementById("tray");
var selectedPieces = []
var playerHand = -1
var gameBoard = -1
var gameData = -1
var selectedPiece = -1
var turnScore = 0


const scores = {
  ' ': 0,
  'A': 1,
  'E': 1,
  'I': 1,
  'O': 1,
  'N': 1,
  'R': 1,
  'T': 1,
  'L': 1,
  'S': 1,
  'U': 1,
  'D': 2,
  'G': 2,
  'B': 3,
  'C': 3,
  'M': 3,
  'P': 3,
  'F': 4,
  'H': 4,
  'V': 4,
  'W': 4,
  'Y': 4,
  'K': 5,
  'J': 8,
  'X': 8,
  'Q': 10,
  'Z': 10
}


function fillTable(grid) {
  document.body.style.setProperty("--grid-rows", grid.length);
  document.body.style.setProperty("--grid-cols", grid[0].length);
  for (var i = 0; i < grid.length; i ++) {
    for(var j = 0; j< grid[i].length; j++) {
      let cell = initializeBoardCell(i, j)
      cell.onclick = function() {
        updateGameState(cell)
      };
      if(grid[i][j] == null) {
        container.appendChild(cell).className += " grid-item";
      } else {
        cell.innerHTML = grid[i][j].letter
        container.appendChild(cell).className += " grid-item";
      }
    }
  }
}


function fillTray(tray) {
  for(var i = 0; i < tray.length; i++) {
    let cell = document.createElement("div")
    cell.innerHTML = tray[i].letter
    cell.setAttribute("tid", tray[i].id)
    cell.onclick = function() {
      playerHand.forEach((tile) => {
        if(tile.id == cell.getAttribute('tid') && !selectedPieces.includes(tile.id)) {
          if(selectedPiece != -1) {
            changeColorOfElementWithTid(selectedPiece.id, "black")
          }
          selectedPiece = tile
          cell.style.color = "green"
        }
      })
    }
    trayContainer.appendChild(cell).classname += "grid-item";
  }
}


function updateGameState(cell) {
  if(cell.innerHTML === "") {
    if (selectedPiece != -1) {
      placeTile(cell)
      updateScore(cell.innerHTML, true)
    }
  } else {
    if (selectedPieces.includes(cell.getAttribute('tid'))) {
      updateScore(cell.innerHTML, false)
      replaceToHand(cell)
    }
  }
}


function updateScore(letter, isIncreasing) {
  if(isIncreasing) {
    turnScore = turnScore + scores[letter]
  } else {
    turnScore = turnScore - scores[letter]
  }
  console.log("Turn Score: ", turnScore)
}


function placeTile(cell) {
  cell.innerHTML = selectedPiece.letter
  selectedPiece.xCoordinate = cell.getAttribute("x")
  selectedPiece.yCoordinate = cell.getAttribute("y")
  selectedPieces.push(selectedPiece.id)
  changeColorOfElementWithTid(selectedPiece.id, "red")
  cell.setAttribute('tid', selectedPiece.id)
  selectedPiece = -1
}


function replaceToHand(cell) {
  const index = selectedPieces.indexOf(cell.getAttribute('tid'));
  if (index > -1) {
    selectedPieces.splice(index, 1);
  }
  cell.innerHTML = ""
  playerHand.forEach((tile) => {
    if(tile.id == cell.getAttribute('tid')) {
      tile.xCoordinate = null
      tile.yCoordinate = null
    }
  })
  changeColorOfElementWithTid(cell.getAttribute('tid'), "black")
  cell.setAttribute('tid', null)
}


function initializeBoardCell(x, y) {
  let cell = document.createElement("div")
  cell.setAttribute('x', x)
  cell.setAttribute('y', y)
  return cell
}


function changeColorOfElementWithTid(tid, color) {
  document.querySelectorAll(`[tid="${tid}"]`).forEach((handPiece) => {
    handPiece.style.color = color
  })
}


playerHand = JSON.parse(document.currentScript.getAttribute('playerHand'))
gameBoard = JSON.parse(document.currentScript.getAttribute('gameBoard'))
gameData = JSON.parse(document.currentScript.getAttribute('gameData'))
console.log("Player Score: ", gameData.playerScore)
fillTable(gameBoard);
fillTray(playerHand);
