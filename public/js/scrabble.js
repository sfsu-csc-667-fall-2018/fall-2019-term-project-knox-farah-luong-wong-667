const container = document.getElementById("con");
const trayContainer = document.getElementById("tray");
var selectedPieces = []
var playerHand = -1
var gameBoard = -1
var selectedPiece = -1


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
    }
  } else {
    if (selectedPieces.includes(cell.getAttribute('tid'))) {
      replaceToHand(cell)
    }
  }
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
fillTable(gameBoard);
fillTray(playerHand);
