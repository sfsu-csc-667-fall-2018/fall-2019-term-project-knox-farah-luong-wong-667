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


function calculateScores() {
  //gameBoard must be updated first
  var calculatedScore = 0
  selectedPieces.forEach((pieceId) => {
    var tile = null
    gameBoard.forEach((row) => {
      row.forEach((column) => {
        if(column != null) {
          if(column.id == pieceId) {
            tile = column
          }
        }
      })
    })
    calculatedScore = calculatedScore + scores[tile.letter]
    turnScore = calculatedScore
  })
  selectedPieces.forEach((pieceId) => {
    //Count all orthogonal words
    var calcPiece = null
    gameBoard.forEach((row) => {
      row.forEach((column) => {
        if(column != null) {
          if(column.id == pieceId) {
            calcPiece = column
          }
        }
      })
    })
    //const calcPiece = getTileFromGameBoard(pieceId)
    //Horizontal
    //Keep going until:
    //Null
    //End of line
    //Piece id is already in selected
    //(selectedPieces.includes(horizontalStart.id) && horizontalStart.id != piece.id)
    var horizontalScore = 0
    var horizontalMultiplier = 1
    var count = 0
    var horizontalStart = gameBoard[calcPiece.xCoordinate][count]
    while(horizontalStart == null && count < 15) {
      console.log("H Start")
      count = count + 1
      horizontalStart = gameBoard[calcPiece.xCoordinate][count]
    }
    //count = 0
    var horizontalEnd = horizontalStart
    while(horizontalEnd == horizontalStart || horizontalEnd != null && count < 15) {
      console.log("H End")
      if(selectedPieces.includes(horizontalEnd.id) && horizontalEnd.id != calcPiece.id) {
        horizontalMultiplier = 0
      }
      horizontalEnd = gameBoard[calcPiece.xCoordinate][count]
      if(horizontalEnd != null) {
        console.log("Horizontal letter: ", horizontalEnd.letter)
        horizontalScore = horizontalScore + scores[horizontalEnd.letter]
      }
      count = count + 1
    }
    horizontalScore = horizontalScore * horizontalMultiplier

    var verticalScore = 0
    var verticalMultiplier = 1
    count = 0
    var verticalStart = gameBoard[count][calcPiece.yCoordinate]
    while(verticalStart == null && count < 15) {
      console.log("V Start")
      count = count + 1
      verticalStart = gameBoard[count][calcPiece.yCoordinate]
    }
    //count = 0
    var verticalEnd = verticalStart
    while(verticalEnd == verticalStart || verticalEnd != null && count < 15) {
      console.log("V End")
      if(selectedPieces.includes(verticalEnd.id) && verticalEnd.id != calcPiece.id) {
        verticalMultiplier = 0
      }
      verticalEnd = gameBoard[count][calcPiece.yCoordinate]
      if(verticalEnd != null) {
        verticalScore = verticalScore + scores[verticalEnd.letter]
      }
      count = count + 1
    }
    verticalScore = verticalScore * verticalMultiplier
    console.log("Letter: ", calcPiece.letter)
    console.log("HorizontalScore: ", horizontalScore)
    console.log("VerticalScore: ", verticalScore)
    console.log("CalculatedScore: ", calculatedScore)
    if(horizontalScore == scores[calcPiece.letter]) {
      horizontalScore = 0
    }
    if(verticalScore == scores[calcPiece.letter]) {
      verticalScore = 0
    }
    turnScore = turnScore + horizontalScore + verticalScore
    console.log("Turn Score: ", turnScore)
  })
}


function getTileFromGameBoard(tid) {
  gameBoard.forEach((row) => {
    row.forEach((column) => {
      if(column != null) {
        if(column.id == tid) {
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
  if(cell.innerHTML === "") {
    if (selectedPiece != -1) {
      placeTile(cell)
      calculateScores()
      //updateScore(cell.innerHTML, true)
    }
  } else {
    if (selectedPieces.includes(cell.getAttribute('tid'))) {
      //updateScore(cell.innerHTML, false)
      calculateScores()
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
  updateGameBoard(selectedPiece, true)
  gameBoard.forEach((element) => {
    console.log(element)
  })
  changeColorOfElementWithTid(selectedPiece.id, "red")
  cell.setAttribute('tid', selectedPiece.id)
  selectedPiece = -1
}


function updateGameBoard(selectedPiece, isAppending) {
  if(isAppending) {
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
    if(tile.id == cell.getAttribute('tid')) {
      updateGameBoard(tile, false)
      tile.xCoordinate = null
      tile.yCoordinate = null
      gameBoard.forEach((element) => {
        console.log(element)
      })
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
