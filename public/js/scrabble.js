const container = document.getElementById("con");

function fillTable(grid) {
  console.log(grid)
  document.body.style.setProperty("--grid-rows", grid.length);
  document.body.style.setProperty("--grid-cols", grid[0].length);
  for (var i = 0; i < grid.length; i ++) {
    for(var j = 0; j< grid[i].length; j++) {
      let cell = document.createElement("div")
      cell.setAttribute('x', i)
      cell.setAttribute('y', j)
      cell.onclick = function() { alert(cell.getAttribute('x')); };
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
