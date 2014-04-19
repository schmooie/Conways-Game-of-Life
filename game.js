function GameOfLife(width,height) {
  this.width = width;
  this.height = height;
}

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

GameOfLife.prototype.coordinateHelper = function(coordArr) {
  if(coordArr) {
    return {x: coordArr[0], y: coordArr[1]};
  } else {
    return false;
  }
};

GameOfLife.prototype.setupBoardEvents = function() {
  // each board cell has an CSS id in the format of: "x-y" 
  // where x is the x-coordinate and y the y-coordinate
  // use this fact to loop through all the ids and assign
  // them "on-click" events that allow a user to click on 
  // cells to setup the initial state of the game
  // before clicking "Step" or "Auto-Play"
  
  // clicking on a cell should toggle the cell between "alive" & "dead"
  // for ex: an "alive" cell be colored "blue", a dead cell could stay white
  
  // for example, here is how we would catch a click event on just the 0-0 cell
  // you need to do something like this for EVERY cell 
  
  var onCellClick = function (e) {
    // coordinates of cell, in case you need them
    var coord_array = this.id.split('-');
    var coord_hash = {x: coord_array[0], y: coord_array[1]};
    
    // how to set the style of the cell when it's clicked
    this.style.backgroundColor = "rgb(204, 51, 51)";
  };

   var rows = document.getElementById('board').children[0].children[0].rows;
   for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].cells;
    for (var j = 0; j < cells.length; j++) {
      cells[j].onclick = onCellClick;
    }
   }
};

GameOfLife.prototype.clear = function() {
  var rows = document.getElementById('board').children[0].children[0].rows;
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].cells;
    for (var j = 0; j < cells.length; j++) {
      cells[j].style.backgroundColor = "rgb(255, 255, 255)";
    }
  }  
};

GameOfLife.prototype.step = function () {
  // Here is where you want to loop through all the cells
  // on the board and determine, based on it's neighbors,
  // whether the cell should be dead or alive in the next
  // evolution of the game

  var aliveColor = "rgb(204, 51, 51)",
      aliveColors = ["rgb(204, 51, 51)", "rgb(204, 51, 128)","rgb(204, 128, 51)"],
      deadColor = "rgb(255, 255, 255)",
      rows = document.getElementById('board').children[0].children[0].rows,
      makeItLive = [],
      makeItDead = [];

  var getRandomColor = function () {
    return aliveColors[Math.floor(Math.random() * 3)];
  };

  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].cells;
    for (var j = 0; j < cells.length; j++) {
      if (isStayingAlive(cells[j])) {
        makeItLive.push(cells[j]);
        // cells[j].style.backgroundColor = aliveColor;
      } else {
        makeItDead.push(cells[j])
        // cells[j].style.backgroundColor = deadColor;
      }
    }
  }

  // asynchronous bullshit
  for (var k = 0; k < makeItLive.length; k++) {
    makeItLive[k].style.backgroundColor = aliveColor;
  }

  for (var l = 0; l < makeItDead.length; l++) {
    makeItDead[l].style.backgroundColor = deadColor;
  }

  function isStayingAlive (cell) {
    var cellCoordinates = cell.id.split('-'), // cellCoordinates[0]: x , cellCoordinates[1]: y
        aliveNeighbors = 0,
        neighbors = [],
        currentlyAlive;

    if (cell.style.backgroundColor === aliveColor) {
      currentlyAlive = true;
    } else {
      currentlyAlive = false;
    }

    // populate neighbors array 

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
      if (document.getElementById(neighbors[i]) && (document.getElementById(neighbors[i]).style.backgroundColor === aliveColor)) {
        aliveNeighbors++;
      }
    }

    if (currentlyAlive && (aliveNeighbors > 3)) {
      return false;
    } else if (currentlyAlive && (aliveNeighbors < 2)) {
      return false;
    } else if (currentlyAlive === false && aliveNeighbors === 3) {
      return true;
    } else if (currentlyAlive === false) {
      return false;
    } else {
      return true;
    }
  } // end of StayingAlive function
};

GameOfLife.prototype.randomize = function() {
  this.clear();
  var rows = document.getElementById('board').children[0].children[0].rows;
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].cells;
    for (var j = 0; j < cells.length; j++) {
      var oneThroughFour = Math.random() * 3 + 1;
      if (oneThroughFour > 3) {
        cells[j].style.backgroundColor = "rgb(204, 51, 51)";
      }
    } 
  }
};



startGame = function () {
  var width = prompt("How wide should the board be?");
  var height = prompt("And how tall should the board be?");
  var gol = new GameOfLife(width,height);
  gol.createAndShowBoard();

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
    gol.clear();
  };

  window.randomize = function () {
    gol.randomize();
  };

};

startGame();