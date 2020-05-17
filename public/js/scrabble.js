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
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      let cell = initializeBoardCell(i, j)
      cell.onclick = function () {
        updateGameState(cell)
      };
      if (grid[i][j] == null) {
        container.appendChild(cell).className += " grid-item";
      } else {
        cell.innerHTML = grid[i][j].letter
        container.appendChild(cell).className += " grid-item";
      }
    }
  }
}


function fillTray(tray) {
  for (var i = 0; i < tray.length; i++) {
    let cell = document.createElement("div")
    cell.innerHTML = tray[i].letter
    cell.setAttribute("tid", tray[i].id)
    cell.onclick = function () {
      playerHand.forEach((tile) => {
        if (tile.id == cell.getAttribute('tid') && !selectedPieces.includes(tile.id)) {
          if (selectedPiece != -1) {
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


function calculateScores() {
  //gameBoard must be updated first
  var columns = getScorableColumns()
  var verticalScore = 0
  columns.forEach((column) => {
    if (column.length > 1) {
      verticalScore = verticalScore + calculateScoreForArray(column)
    }
  })
  var rows = getScorableRows()
  var horizontalScore = 0
  rows.forEach((row) => {
    if (row.length > 1) {
      horizontalScore = horizontalScore + calculateScoreForArray(row)
    }
  })
  var totalScore = verticalScore + horizontalScore
  if (verticalScore == 0 && horizontalScore == 0) {
    totalScore = addSelectedPieces()
  }
  document.getElementById("score").innerHTML = "Score: " + totalScore;
}


function calculateScoreForArray(arr) {
  score = 0
  arr.forEach((element) => {
    score = score + scores[element.letter]
  })
  return score
}


function addSelectedPieces() {
  var calculatedScore = 0
  selectedPieces.forEach((pieceId) => {
    var tile = null
    gameBoard.forEach((row) => {
      row.forEach((column) => {
        if (column != null) {
          if (column.id == pieceId) {
            tile = column
          }
        }
      })
    })
    calculatedScore = calculatedScore + scores[tile.letter]
  })
  return calculatedScore
}


function getScorableColumns() {
  var allColumns = []
  var subArr = []
  var foundSelected = false
  for (var i = 0; i < gameBoard[0].length; i++) {
    for (var j = 0; j < gameBoard.length; j++) {
      if (gameBoard[j][i] != null) {
        subArr.push(gameBoard[j][i])
        if (selectedPieces.includes(gameBoard[j][i].id)) {
          foundSelected = true
        }
      }
      if (gameBoard[j][i] == null) {
        if (subArr.length > 0) {
          if (foundSelected == true) {
            allColumns.push(subArr)
            foundSelected = false
          }
        }
        subArr = []
      }
    }
  }
  return allColumns
}


function getScorableRows() {
  var allRows = []
  var subArr = []
  var foundSelected = false
  for (var i = 0; i < gameBoard.length; i++) {
    for (var j = 0; j < gameBoard.length; j++) {
      if (gameBoard[i][j] != null) {
        subArr.push(gameBoard[i][j])
        if (selectedPieces.includes(gameBoard[i][j].id)) {
          foundSelected = true
        }
      }
      if (gameBoard[i][j] == null) {
        if (subArr.length > 0) {
          if (foundSelected == true) {
            allRows.push(subArr)
            foundSelected = false
          }
        }
        subArr = []
      }
    }
  }
  return allRows
}


function getTileFromGameBoard(tid) {
  gameBoard.forEach((row) => {
    row.forEach((column) => {
      if (column != null) {
        if (column.id == tid) {
          return column
        }
      }
    })
  })
  return null
}


function validatePiecePlacement() {
  //gameBoard must be updated so this logic will work
  //Check if the placed word is:
  //Connected to itself
  //Attached to an already existing tile
  //All words attached to a letter in the placed word are actually words
  //Use Oxford api for this
}

function updateGameState(cell) {
  if (cell.innerHTML === "") {
    if (selectedPiece != -1) {
      placeTile(cell)
      calculateScores()
    }
  } else {
    if (selectedPieces.includes(cell.getAttribute('tid'))) {
      replaceToHand(cell)
      calculateScores()
    }
  }
}


function updateScore(letter, isIncreasing) {
  if (isIncreasing) {
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
  updateGameBoard(selectedPiece, true)
  changeColorOfElementWithTid(selectedPiece.id, "red")
  cell.setAttribute('tid', selectedPiece.id)
  selectedPiece = -1
}


function updateGameBoard(selectedPiece, isAppending) {
  if (isAppending) {
    gameBoard[selectedPiece.xCoordinate][selectedPiece.yCoordinate] = selectedPiece
  } else {
    gameBoard[selectedPiece.xCoordinate][selectedPiece.yCoordinate] = null
  }
}


function replaceToHand(cell) {
  const index = selectedPieces.indexOf(cell.getAttribute('tid'));
  if (index > -1) {
    selectedPieces.splice(index, 1);
  }
  cell.innerHTML = ""
  playerHand.forEach((tile) => {
    if (tile.id == cell.getAttribute('tid')) {
      updateGameBoard(tile, false)
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
