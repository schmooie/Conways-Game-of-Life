function GameOfLife(width,height) {
  this.width = width;
  this.height = height;
  this.alive = {_Colors: ["rgb(239, 89, 123)", "rgb(255, 109, 49)","rgb(115, 182, 107)", "rgb(255, 203, 24)", "rgb(41, 162, 198)"]};
  this.deadColor = "rgb(255, 255, 255)",
  this.cellsAlive = 0;
}

GameOfLife.prototype.getCells = function() {
	var arrayOfCells = [],
			rows = document.getElementById('board').children[0].children[0].rows;
	for (var i = 0; i < rows.length; i++) {
  	var cells = rows[i].cells;
		for (var j = 0; j < cells.length; j++) {
    	arrayOfCells.push(cells[j]);
  	}
   }
  return arrayOfCells;
};

GameOfLife.prototype.getRandomColor = function() {
  return this.alive._Colors[Math.floor(Math.random() * 5)];
};

GameOfLife.prototype.createAndShowBoard = function () {
  var goltable = document.createElement("table");
  var tablehtml = '';
  for (var h=0; h<this.height; h++) {
    tablehtml += "<tr id='row+" + h + "'>";
    for (var w=0; w<this.width; w++) {
      tablehtml += "<td id='" + w + "-" + h + "'></td>";
    }
    tablehtml += "</tr>";
  }
  goltable.innerHTML = tablehtml;
  var board = document.getElementById('board');
  board.appendChild(goltable);
  this.setupBoardEvents();
};

GameOfLife.prototype.setupBoardEvents = function() { 
  var board = this, 
  		cells = this.getCells();

  var onCellClick = function (e) {
    this.style.backgroundColor = board.getRandomColor();
    // board.cellsAlive++;
  };

  for (var i = 0; i < cells.length; i++) {
  	cells[i].onclick = onCellClick;
  }
};

GameOfLife.prototype.step = function () {
  var makeItLive = [],
      makeItDead = [],
      board = this,
      cells = this.getCells();

    // 1 = staying alive
    // 2 = becoming alive
    // 3 = dead

  for (var j = 0; j < cells.length; j++) {
	  if (isStayingAlive(cells[j]) === 2) {
	    makeItLive.push(cells[j]);
	  } else if (isStayingAlive(cells[j]) === 3) {
	    makeItDead.push(cells[j])
	  }
	}

  // asynchronous bullshit
  for (var k = 0; k < makeItLive.length; k++) {
    makeItLive[k].style.backgroundColor = this.getRandomColor();
  }

  for (var l = 0; l < makeItDead.length; l++) {
    makeItDead[l].style.backgroundColor = this.deadColor;
  }

  // board.cellsAlive = cells.length - makeItDead.length;

  function isStayingAlive (cell) {
    var cellCoordinates = cell.id.split('-'), // cellCoordinates[0]: x , cellCoordinates[1]: y
        aliveNeighbors = 0,
        neighbors = [],
        currentlyAlive = false;

  for (var y = 0; y < board.alive._Colors.length; y++){
    if (cell.style.backgroundColor === board.alive._Colors[y]) {
      currentlyAlive = true;
    }
  }
    // top left
    neighbors.push((parseInt(cellCoordinates[0]) - 1) + '-' + (parseInt(cellCoordinates[1]) - 1));
    // top center
    neighbors.push((parseInt(cellCoordinates[0])) + '-' + (parseInt(cellCoordinates[1]) - 1));
    // top right
    neighbors.push((parseInt(cellCoordinates[0]) + 1) + '-' + (parseInt(cellCoordinates[1]) - 1));
    // left
    neighbors.push((parseInt(cellCoordinates[0]) - 1) + '-' + (parseInt(cellCoordinates[1])));
    // right
    neighbors.push((parseInt(cellCoordinates[0]) + 1) + '-' + (parseInt(cellCoordinates[1])));
    // bottom left
    neighbors.push((parseInt(cellCoordinates[0]) - 1) + '-' + (parseInt(cellCoordinates[1]) + 1));
    // bottom center
    neighbors.push((parseInt(cellCoordinates[0])) + '-' + (parseInt(cellCoordinates[1]) + 1));
    // bottom right
    neighbors.push((parseInt(cellCoordinates[0]) + 1) + '-' + (parseInt(cellCoordinates[1]) + 1));

    for (var i = 0; i < neighbors.length; i++) {
    	var neighbor = document.getElementById(neighbors[i]);
      if (neighbor) {
        for (var j = 0; j < board.alive._Colors.length; j++) {
          if (neighbor.style.backgroundColor === board.alive._Colors[j]) {
            aliveNeighbors++;
          }
        }
      }
    }

    if (currentlyAlive && (aliveNeighbors > 3)) {
      return 3;
    } else if (currentlyAlive && (aliveNeighbors < 2)) {
      return 3;
    } else if (currentlyAlive === false && aliveNeighbors === 3) {
      return 2;
    } else if (currentlyAlive === false) {
      return 3;
    } else {
      return 1;
    }
  } // end of StayingAlive function
};

GameOfLife.prototype.clear = function() {
  var rows = document.getElementById('board').children[0].children[0].rows;
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].cells;
    for (var j = 0; j < cells.length; j++) {
      cells[j].style.backgroundColor = this.deadColor;
    }
  }  
};

GameOfLife.prototype.randomize = function() {
  this.clear();
  var rows = document.getElementById('board').children[0].children[0].rows;
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].cells;
    for (var j = 0; j < cells.length; j++) {
      var oneThroughSeven = Math.random() * 7 + 1;
      if (oneThroughSeven > 6) {
        cells[j].style.backgroundColor = this.getRandomColor();
      }
    } 
  }
};

startGame = function () {
  var gol;

  window.setWidthAndHeight = function () {
    var form = document.forms[0],
        height = parseInt(form[0].value),
        width = parseInt(form[1].value);
    if (gol) {
      return false;
    } else {
      gol = new GameOfLife(width, height);
      gol.createAndShowBoard();
    }
    return false;
  };

  window.step = function () {
    gol.step();
  };

  var automation;

  window.autoplay = function () {
    if (typeof automation == "undefined") {
      automation = window.setInterval(window.step, 100);
    }
  };

  window.pause = function () {
    clearInterval(automation);
    automation = undefined;
  };

  window.clearBoard = function () {
    window.pause();
    gol.clear();
  };

  window.randomize = function () {
    gol.randomize();
  };
};

startGame();
// add in a box that shows you how many cells are currently alive
// how many steps have gone by
// what was the peak amount of alive cells
// slider for speed of autoplay
// form for window size