const container = document.getElementById("con");
const trayContainer = document.getElementById("tray");
var selectedPieces = []
var playerHand = -1
var gameBoard = -1
var selectedX = -1
var selectedY = -1
var selectedPiece = -1

function fillTable(grid) {
  console.log(grid)
  document.body.style.setProperty("--grid-rows", grid.length);
  document.body.style.setProperty("--grid-cols", grid[0].length);
  for (var i = 0; i < grid.length; i ++) {
    for(var j = 0; j< grid[i].length; j++) {
      let cell = document.createElement("div")
      cell.setAttribute('x', i)
      cell.setAttribute('y', j)
      cell.onclick = function() {
        console.log("Inner HTML: ", cell.innerHTML)
        if(cell.innerHTML === "") {
          selectedX = cell.getAttribute('x')
          selectedY = cell.getAttribute('y')
          if (selectedPiece != -1) {
            cell.innerHTML = selectedPiece.letter
            selectedPiece.xCoordinate = cell.getAttribute("x")
            selectedPiece.yCoordinate = cell.getAttribute("y")
            selectedPieces.push(selectedPiece.id)
            document.querySelectorAll(`[tid="${selectedPiece.id}"]`).forEach((handPiece) => {
              handPiece.style.color = "red"
            })
            cell.setAttribute('tid', selectedPiece.id)
            selectedPiece = -1
          }
        } else {
          if (selectedPieces.includes(cell.getAttribute('tid'))) {
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
            document.querySelectorAll(`[tid="${cell.getAttribute('tid')}"]`).forEach((handPiece) => {
              handPiece.style.color = "black"
            })
            cell.setAttribute('tid', null)
          }
        }
      };
      if(grid[i][j] == null) {
        container.appendChild(cell).className += " grid-item";
      } else {
        console.log(grid[i])
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
            document.querySelectorAll(`[tid="${selectedPiece.id}"]`).forEach((handPiece) => {
              handPiece.style.color = "black"
            })
          }
          selectedPiece = tile
          cell.style.color = "green"
        }
      })
    }
    trayContainer.appendChild(cell).classname += "grid-item";
  }
}

playerHand = JSON.parse(document.currentScript.getAttribute('playerHand'))
gameBoard = JSON.parse(document.currentScript.getAttribute('gameBoard'))
fillTable(gameBoard);
fillTray(playerHand);
