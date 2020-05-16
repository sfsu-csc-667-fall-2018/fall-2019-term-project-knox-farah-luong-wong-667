const container = document.getElementById("con");

var selectedX = -1
var selectedY = -1
//I have:
//Hand and board
//If I click on board I want it to stay highighted
//If I click on a tile in the hand I want it to stay highlighted
//If there is a selected board square and it is empty place the tile in the hand there
//If it isn't empty, do not highlight the tile
//Remove the tile from 

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
          console.log("Selected X: ", selectedX, "| Selected Y: ", selectedY)
        }
      }; //What do I want to happen here?
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

fillTable(JSON.parse(document.currentScript.getAttribute('gameBoard')));
