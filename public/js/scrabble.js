const container = document.getElementById("con");
const letterContainer = document.getElementById("letterContainer");
var v = 50;
var globalSnapTimer = null;

function makeTable(rows) {
  var cols = rows;
  document.body.style.setProperty("--grid-rows", rows);
  document.body.style.setProperty("--grid-cols", cols);
  var grid = [
    [4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4],
    [0, 2, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 2, 0],
    [0, 0, 2, 0, 0, 0, 1, 0, 1, 0, 0, 0, 2, 0, 0],
    [1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1],
    [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
    [0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
    [4, 0, 0, 1, 0, 0, 0, 5, 0, 0, 0, 1, 0, 0, 4],
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0],
    [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
    [1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1],
    [0, 0, 2, 0, 0, 0, 1, 0, 1, 0, 0, 0, 2, 0, 0],
    [0, 2, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 2, 0],
    [4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4]
  ];

  for (c = 0; c < rows * cols; c++) {
    let cell = document.createElement("div");

    if (grid[Math.floor(c / 15)][c % 15] == 4) {
      cell.className = "multiplier";
      cell.innerHTML = "Triple word";
      cell.style.backgroundColor = "#F5654A";
    } else if (grid[Math.floor(c / 15)][c % 15] == 2) {
      cell.className = "multiplier";
      cell.innerHTML = "<sub>Double</sub> word";
      cell.style.backgroundColor = "#F9BBAC";
    } else if (grid[Math.floor(c / 15)][c % 15] == 3) {
      cell.className = "multiplier";
      cell.innerHTML = "Triple letter";
      cell.style.backgroundColor = "#3597B0";
    } else if (grid[Math.floor(c / 15)][c % 15] == 1) {
      cell.className = "multiplier";
      cell.innerHTML = "<sub>Double</sub> letter";
      cell.style.backgroundColor = "#B8CDC8";
    } else if (grid[Math.floor(c / 15)][c % 15] == 5) {
      let star = document.createElement("IMG");
      star.id = "star";
      cell.className = "multiplier";
      star.setAttribute(
        "src",
        "https://upload.wikimedia.org/wikipedia/commons/7/78/BlackStar.PNG"
      );
      star.setAttribute("draggable", false);
      cell.style.backgroundColor = "#F9BBAC";
      cell.appendChild(star);
    }
    container.appendChild(cell).className += " grid-item";
  }
}

makeTable(15);

