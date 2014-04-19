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

  var board = this; 
  var onCellClick = function (e) {
    // coordinates of cell, in case you need them
    var coord_array = this.id.split('-');
    var coord_hash = {x: coord_array[0], y: coord_array[1]};
    
    this.style.backgroundColor = board.getRandomColor();
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
  var aliveColor = "rgb(204, 51, 51)",
      aliveColors = ["rgb(255, 118, 0)", "rgb(255, 152, 64)","rgb(255, 180, 115)", "rgb(1, 147, 154)"],
      deadColor = "rgb(255, 255, 255)",
      rows = document.getElementById('board').children[0].children[0].rows,
      alreadyLiving = [],
      makeItLive = [],
      makeItDead = [];

    // 1 = staying alive
    // 2 = becoming alive
    // 3 = dead

  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].cells;
    for (var j = 0; j < cells.length; j++) {
      if (isStayingAlive(cells[j]) === 2) {
        makeItLive.push(cells[j]);
      } else if (isStayingAlive(cells[j]) === 3) {
        makeItDead.push(cells[j])
      }
    }
  }

  // asynchronous bullshit
  for (var k = 0; k < makeItLive.length; k++) {
    makeItLive[k].style.backgroundColor = this.getRandomColor();
  }

  for (var l = 0; l < makeItDead.length; l++) {
    makeItDead[l].style.backgroundColor = deadColor;
  }

  function isStayingAlive (cell) {
    var cellCoordinates = cell.id.split('-'), // cellCoordinates[0]: x , cellCoordinates[1]: y
        aliveNeighbors = 0,
        neighbors = [],
        currentlyAlive = false;

    for (var y = 0; y < aliveColors.length; y++){
      if (cell.style.backgroundColor === aliveColors[y]) {
        currentlyAlive = true;
      }
    }

    // if (cell.style.backgroundColor === aliveColor) {
    //   currentlyAlive = true;
    // } else if () 
    // else {
    //   currentlyAlive = false;
    // }

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


    // for (var i = 0; i < neighbors.length; i++) {
    //   if (document.getElementById(neighbors[i]) && (document.getElementById(neighbors[i]).style.backgroundColor === aliveColor)) {
    //     aliveNeighbors++;
    //   }
    // }

    for (var i = 0; i < neighbors.length; i++) {
      if (document.getElementById(neighbors[i])) {
        for (var x = 0; x < aliveColors.length; x++) {
          if (document.getElementById(neighbors[i]).style.backgroundColor === aliveColors[x]) {
            aliveNeighbors++;
          }
        }
      }
    }


    // 1 = staying alive
    // 2 = becoming alive
    // 3 = dead
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

GameOfLife.prototype.getRandomColor = function() {
  var aliveColors = ["rgb(255, 118, 0)", "rgb(255, 152, 64)","rgb(255, 180, 115)", "rgb(1, 147, 154)"];
  return aliveColors[Math.floor(Math.random() * 4)];
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