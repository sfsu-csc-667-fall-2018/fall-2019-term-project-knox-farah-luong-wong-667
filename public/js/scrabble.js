const container = document.getElementById("con");
var v = 50;
var globalSnapTimer = null;

function fillTable(grid) {
  console.log(grid)
  document.body.style.setProperty("--grid-rows", grid.length);
  document.body.style.setProperty("--grid-cols", grid[0].length);
  for (var i = 0; i < grid.length; i ++) {
    for(var j = 0; j< grid[i].length; j++) {
      let cell = document.createElement("div")
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
