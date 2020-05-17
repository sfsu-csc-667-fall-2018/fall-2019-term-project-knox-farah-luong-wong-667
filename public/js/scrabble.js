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
  var columns = getScorableColumns()
  var verticalScore = 0
  columns.forEach((column) => {
    if(column.length > 1) { 
      verticalScore = verticalScore + calculateScoreForArray(column)
    }
  })
  var rows = getScorableRows()
  var horizontalScore = 0
  rows.forEach((row) => {
    if(row.length > 1) {
      horizontalScore = horizontalScore + calculateScoreForArray(row)
    }
  })
  var totalScore = verticalScore + horizontalScore
  if(verticalScore == 0 && horizontalScore == 0) {
    totalScore = addSelectedPieces()
  }
  console.log("Total Score: ", totalScore)
  return totalScore
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
        if(column != null) {
          if(column.id == pieceId) {
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
  for(var i = 0; i < gameBoard[0].length; i++) {
    for(var j = 0; j < gameBoard.length; j++) {
      if(gameBoard[j][i] != null) {
        subArr.push(gameBoard[j][i])
        if(selectedPieces.includes(gameBoard[j][i].id)) {
          foundSelected = true
        }
      }
      if(gameBoard[j][i] == null) {
        if(subArr.length > 0) {
          if(foundSelected == true) {
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
  for(var i = 0; i < gameBoard.length; i++) {
    for(var j = 0; j < gameBoard.length; j++) {
      if(gameBoard[i][j] != null) {
        subArr.push(gameBoard[i][j])
        if(selectedPieces.includes(gameBoard[i][j].id)) {
          foundSelected = true
        }
      }
      if(gameBoard[i][j] == null) {
        if(subArr.length > 0) {
          if(foundSelected == true) {
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
  //Uncomment this line to see output about valid words in console
  //Only use sparingly because we have a 1000 request limit with a free account
  //When we have a submit button we will call this on submit pressed to limit usage
  //checkIfWordsAreValid()
  return (isConnectedToBoard() && (isValidHorizontalPlacement() || isValidVerticalPlacement()))
}


function checkIfWordsAreValid() {
  var allWordsValid = true
  var words = getWordsFromPlacement()
  if(words.length > 0) {
    for(var i = 0; i < words.length; i++) {
      if(!isWordValid(words[i])) {
        allWordsValid = false
      }
    }
    console.log("All Words Valid?")
    console.log(allWordsValid)
    return allWordsValid
  } else {
    console.log("All Words Valid?")
    console.log("false")
    return false
  }
}


function isWordValid(word) {
  var url = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=d4ac4ba8-63b6-44d6-a80d-48c712fbb8cf"
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", url, false );
  xmlHttp.send( null );
  var responseJson = JSON.parse(xmlHttp.responseText)
  for(var i = 0; i < responseJson.length; i++) {
    if(responseJson[i].meta == undefined) {
      console.log("No definition for " + word)
      return false
    }
  }
  console.log("Definitions found for " + word)
  return true
}


function getWordsFromPlacement() {
  var allWords = []
  var columns = getScorableColumns()
  for(var i = 0; i < columns.length; i++) {
    var newWord = ""
    if(columns[i].length > 1) {
      for(var j = 0; j < columns[i].length; j++) {
        newWord = newWord + columns[i][j].letter
      }
      allWords.push(newWord)
    }
  }
  var rows = getScorableRows()
  for(var i = 0; i < rows.length; i++) {
    var newWord = ""
    if(rows[i].length > 1) {
      for(var j = 0; j < rows[i].length; j++) {
        newWord = newWord + rows[i][j].letter
      }
      allWords.push(newWord)
    }
  }
  return allWords
}


function getTileFromId(pieceId) {
  for(var i = 0; i < gameBoard.length; i++) {
    for(var j = 0; j < gameBoard[0].length; j++) {
      if(gameBoard[i][j] != null) {
        if(gameBoard[i][j].id == pieceId) {
          return gameBoard[i][j]
        }
      }
    }
  }
  return null
}


function isConnectedToBoard() {
  if(isBoardEmpty()) {
    return isConnectedToMiddle()
  } else {
    for(var i = 0; i < selectedPieces.length; i++) {
      var tile = getTileFromId(selectedPieces[i])
      if(isConnectedToPiece(tile)) {
        return true
      }
    }
    return false
  }
}


function isBoardEmpty() {
  for(var i = 0; i < gameBoard.length; i++) {
    for(var j = 0; j < gameBoard.length; j++) {
      if(gameBoard[i][j] != null) {
        return false
      }
    }
  }
  return true
}


function isConnectedToMiddle() {
  var columns = getScorableColumns()
  for(var i = 0; i < columns.length; i++) {
    if(Number(columns[i][0].yCoordinate) == 7) {
      for(var j = 0; j < columns[i].length; j++) {
        if(Number(columns[i][j].xCoordinate) == 7) {
          return true
        }
      }
    }
  }
  var rows = getScorableRows()
  for(var i = 0; i < rows.length; i++) {
    if(Number(rows[i][0].xCoordinate) == 7) {
      for(var j = 0; j < rows[i].length; j++) {
        if(Number(rows[i][j].yCoordinate) == 7) {
          return true
        }
      }
    }
  }
  return false
}


function isConnectedToPiece(placement) {
  var x = Number(placement.xCoordinate)
  var y = Number(placement.yCoordinate)

  if(x + 1 < 16 && gameBoard[x + 1][y] != null && !selectedPieces.includes(gameBoard[x + 1][y].id)) {
    return true
  }
  if(x - 1 > -1 && gameBoard[x - 1][y] != null && !selectedPieces.includes(gameBoard[x - 1][y].id)) {
    return true
  }
  if(y + 1 < 16 && gameBoard[x][y + 1] != null && !selectedPieces.includes(gameBoard[x][y + 1].id)) {
    return true
  }
  if(y - 1 > -1 && gameBoard[x][y - 1] != null && !selectedPieces.includes(gameBoard[x][y - 1].id)) {
    return true
  }
  return false
}


function isValidHorizontalPlacement() {
  var horizontalIndex
  var lowest = 16
  var highest = 0
  for(var i = 0; i < selectedPieces.length; i++) {
    var tile = getTileFromId(selectedPieces[i])
    if(horizontalIndex == null) {
      horizontalIndex = tile.xCoordinate
    }
    if(tile.yCoordinate < lowest) {
      lowest = tile.yCoordinate
    }
    if(tile.yCoordinate > highest) {
      highest = tile.yCoordinate
    }
    if(horizontalIndex != tile.xCoordinate) {
      return false
    }
  }
  for(var i = lowest; i < highest; i++) {
    if(gameBoard[horizontalIndex][i] == null) {
      return false
    }
  }
  return true
}


function isValidVerticalPlacement() {
  var verticalIndex
  var lowest = 16
  var highest = 0
  for(var i = 0; i < selectedPieces.length; i++) {
    var tile = getTileFromId(selectedPieces[i])
    if(verticalIndex == null) {
      verticalIndex = tile.yCoordinate
    }
    if(tile.xCoordinate < lowest) {
      lowest = tile.xCoordinate
    }
    if(tile.xCoordinate > highest) {
      highest = tile.xCoordinate
    }
    if(verticalIndex != tile.yCoordinate) {
      return false
    }
  }
  for(var i = lowest; i < highest; i++) {
    if(gameBoard[i][verticalIndex] == null) {
      return false
    }
  }
  return true
}


function updateGameState(cell) {
  if(cell.innerHTML === "") {
    if (selectedPiece != -1) {
      placeTile(cell)
      turnScore = calculateScores()
      var isValid = validatePiecePlacement()
      console.log("Is placement valid?")
      console.log(isValid)
    }
  } else {
    if (selectedPieces.includes(cell.getAttribute('tid'))) {
      replaceToHand(cell)
      turnScore = calculateScores()
      var isValid = validatePiecePlacement()
      console.log("Is placement valid?")
      console.log(isValid)
    }
  }
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
