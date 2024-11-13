let width;
let height;
let needs_redraw = true;
let homeButton;
let resetButton;
let paused = false;
let started = false;
let rectx = [];
let recty = [];
let cellArr= [];
let is_hovered = false;
let lineArrVertical = [];
let lineArrHorizontal = [];
let prevCell;
let currentTime = 0;
let startTime = 0;
//line class

class Line {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.hidden = false;
  }

  // Method to display the line
  display() {
    if (!this.hidden) {
      line(this.x1, this.y1, this.x2, this.y2);
      
    }
  }

  setHidden(x) {
    this.hidden = x;
  }
}

class Cell {
  constructor(x1, y1, color) {
    this.x1 = x1;
    this.y1 = y1;
    this.color = color
    this.topWallHidden = false;
    this.leftWallHidden = false;
    this.rightWallHidden = false;
    this.bottomWallHidden = false;
    this.visited = false;
  }

  display() {
    
    noStroke();
    fill(this.color);
    rect(this.x1, this.y1, 60, 60);
    stroke('Black');
    strokeWeight(2);
    if (!this.topWallHidden) {
      line(this.x1, this.y1, this.x1 + 60, this.y1);
    }
    if (!this.rightWallHidden) {
      line(this.x1 + 60, this.y1, this.x1 + 60, this.y1 + 60);
    }
    if (!this.bottomWallHidden) {
      line(this.x1, this.y1 + 60, this.x1 + 60, this.y1 + 60);
    }
    if (!this.leftWallHidden) {
      line(this.x1, this.y1, this.x1, this.y1 + 60);
    }
  }
  getX1() {
    return this.x1;
  }
  getY1() {
    return this.y1;
  }

  getX1Rel() {
    return (this.x1 - (width / 2) + (300))/ 60;
  }
  getY1Rel() {
    return (this.y1 + 60 - 110) / 60;
  }

  changeColor(col){
    this.color = col;
    this.display();
  }
  breakWall(wall) {
    //0 - 4
    switch(wall) {
      case 0:
        this.topWallHidden = true;
        break;
      case 1:
        this.rightWallHidden = true;
        break;
      case 2:
        this.bottomWallHidden = true;
        break;
      case 3:
        this.leftWallHidden = true;
        break;
    }
    
  }

  getWallStat(dir) {
    switch(dir) {
      case 0:
        return this.topWallHidden;
        
      case 1:
        return this.rightWallHidden;
        
      case 2:
        return this.bottomWallHidden;
        
      case 3:
        return this.leftWallHidden;
        
    }
  }

  fixWall(wall) {
    //0 - 4
    switch(wall) {
      case 0:
        this.topWallHidden = false;
        break;
      case 1:
        this.rightWallHidden = false;
        break;
      case 2:
        this.bottomWallHidden = false;
        break;
      case 3:
        this.leftWallHidden = false;
        break;
    }
    //this.display();
  }
}


function getRandomDirection() {
  const directions = [
    { dx: 1, dy: 0 },  // Right
    { dx: -1, dy: 0 }, // Left
    { dx: 0, dy: 1 },  // Down
    { dx: 0, dy: -1 }  // Up
  ];
  const randomIndex = Math.floor(Math.random() * directions.length);
  return directions[randomIndex];
}

//loads font and sets canvas size
function setup() {
  loadFont("JetBrainsMono-Regular.ttf", font => {
    textFont(font);
  });
  width = windowWidth;
  height = windowHeight;
  createCanvas(width, height);
}

function draw() {
	
	if (needs_redraw) {
    resetText = true;
    homeButton = null;
    background("#333437");
    makeGamePage();
		drawPanel()
    needs_redraw = false;
    prevCell = cellArr[0 * 7 + 0];
    noStroke();
    fill("white");
    text("Start at red square and drag to yellow", 20, height - 50);
    text("Do not stop holding left mouse button or you will need to restart", 20, height - 20);
  }
  checkRectHover();
	checkHover();
  
	if (!paused && started) {
		if (!mouseIsPressed) {
      print("Failed");
      fill("#444444");
      noStroke();
      rect((width/2) - (200/2), 560, 200, 50, 20);
      fill("white");
      currentTime = millis();
      text("DNF",(width / 2) - (textWidth("DNF")) / 2, 560 + 35);
      noLoop();
    }
	}
  
}

function checkRectHover() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 7; j++) {
      
      let cell = cellArr[i * 7 + j];
      //print(cell);
      
      if (mouseX >= cell.getX1() && mouseX <= cell.getX1() + 60 && mouseY >= cell.getY1() && mouseY <= cell.getY1() + 60) {
        if (mouseIsPressed) {
          
          if (prevCell && prevCell !== cell) {
            //prevCell.changeColor("green");
          }

          //draw only if wall was broken
          let dir = getCellDir(prevCell, cell);

          if(prevCell.getWallStat(dir) === true) {
            if (!started) {
              startTime = millis();
            }
            started = true;

            prevCell.changeColor("red");
            prevCell = cell;
            cell.changeColor("green");
            if (cell.getX1Rel() == 9 && cell.getY1Rel() == 6) {
              fill("#444444");
              noStroke();
              rect((width/2) - (200/2), 560, 200, 50, 20);
              fill("white");
              currentTime = millis();
              text("Time: " + Math.floor(currentTime - startTime) + " ms",(width / 2) - (textWidth("Time " + Math.floor(currentTime - startTime) + " ms")) / 2, 560 + 35);
              noLoop();
            }
          }
          
          
          
          

        }
      }
      
    }
    
  }
  
  
}

function drawRect() {
  fill("white");
  stroke('white');
  rect((width/2) - (600/2), 50, 600, 420, 0);
}

function drawPanel() {
  rectx = [];
  recty = [];
	fill("#444444");
  stroke('white');
	rect((width/2) - (600/2), 50, 600, 420, 0);
  
  
  for (let x = 0; x < 10; x++) {
    
    for (let y = 0; y < 7; y++) {
      //fill("black");
      // changeCell(x, y, "Black");
      // noStroke();
      // rectColor.push("black");
      // rectx.push((width/2) - (600/2) + (60 * x));
      // recty.push(110 + (60 * y) - 60);
      let cell = new Cell((width/2) - (600/2) + (60 * x), 110 + (60 * y) - 60, "white");
      cellArr.push(cell);
      cell.display();
    }
  }
  generateMaze();
  drawRect();
  for (let x = 0; x < 10; x++) {
    
    for (let y = 0; y < 7; y++) {
      cellArr[x * 7 + y].display();
    }
  }
  
}

let canGo = true;

function generateMaze() {
  let stack = [];
  let start = cellArr[0];
  stack.push(start);
  start.visited = true;
  start.changeColor("red");
  while(stack.length > 0 && canGo) {
    
    
    let current = stack[stack.length - 1];
    let tmp = getUnvisitedNeighbors(current);
    
    if (tmp.length > 0) {
      
      let next = tmp[getRandomInt(0, tmp.length - 1)];
      // remove wall
      //print (tmp)
      removeWall(current, next);
      next.visited = true;
      //next.changeColor("green")
      stack.push(next);
    }
    else {
      stack.pop();
    }
    
    
    
  }

  cellArr[9 * 7 + 6].changeColor("yellow");
  
}

function keyPressed() {
  // Check if the pressed key is a letter (a-z or A-Z)
  if (keyCode === SHIFT) {
    canGo = true;
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function removeWall(currentCell, next) {
  // check direction
  
  let dir = 0;
  if (currentCell.getX1Rel() > next.getX1Rel()) {
    currentCell.breakWall(3);
      next.breakWall(1);
  }
  if (currentCell.getX1Rel() < next.getX1Rel()) {
    currentCell.breakWall(1);
    next.breakWall(3);
  }

  if (currentCell.getY1Rel() < next.getY1Rel()) {
    currentCell.breakWall(2);
    next.breakWall(0);
  }
  if (currentCell.getY1Rel() > next.getY1Rel()) {
    currentCell.breakWall(0);
    next.breakWall(2);
  }
  
  
}

function getCellDir(currentCell, next) {
  // check direction
  
  let dir = 0;
  if (currentCell.getX1Rel() > next.getX1Rel()) {
    dir = 3;
  }
  if (currentCell.getX1Rel() < next.getX1Rel()) {
    dir = 1;
  }

  if (currentCell.getY1Rel() < next.getY1Rel()) {
    dir = 2;
  }
  if (currentCell.getY1Rel() > next.getY1Rel()) {
    dir = 0;
  }
  return dir;
  
}



function getUnvisitedNeighbors(cell) {
  let neighbors = [];
  let dir = [0,1,2,3];
  
  for (let i = 0; i < dir.length; i++) {
    
    let neighbor = getNeighbor(cell, dir[i]);
    
    if ((neighbor[0] >= 0 && neighbor[0] < 10 && neighbor[1] >= 0 && neighbor[1] < 7)) {
      if (!cellArr[neighbor[0] * 7 + neighbor[1]].visited) {
        neighbors.push(cellArr[neighbor[0] * 7 + neighbor[1]]);

      }
    }
  }
  
  return neighbors;

}

function getNeighbor(cell, dir) {
  switch(dir) {
    case 0:
      return [cell.getX1Rel(), cell.getY1Rel() - 1];
      
    case 1:
      return [cell.getX1Rel() + 1, cell.getY1Rel()];
      
    case 2:
      return [cell.getX1Rel(), cell.getY1Rel() + 1];
      
    case 3:
      return [cell.getX1Rel() - 1, cell.getY1Rel()];
      
  }
}


function makeGamePage() {
  // Create the "Back to Home" button
	background("#333437");
  drawPanel();
  textSize(20);
  fill("white");
  noStroke();
  text("Mouse Movement Game", 20, 40);
  homeButton = createButton('Back to Home');
	
  resetButton = createButton("Reset");
  resetButton.position(width/2 - resetButton/2, 480);
  homeButton.position(width - homeButton.width - 50, 20);
  homeButton.mousePressed(goToHome);

  resetButton.mousePressed(reset);
  // Optional styling
  homeButton.style('background-color', '#444444');
  homeButton.style('font-family', 'JetBrains Mono');
  homeButton.style('color', 'white');``
  homeButton.style('padding', '10px 20px');
  homeButton.style('border', '5px');
  homeButton.style('border-radius', '5px');

  resetButton.style('background-color', '#444444');
  resetButton.style('border', '5px');
  resetButton.style('color', 'white');
  resetButton.style('padding', '5px 10px');
  resetButton.style('border-radius', '5px');
}


function goToHome() {
  window.location.href = 'index.html';
}

function reset() {
  //empty arrays
  started = false;
  prevCell = null;
  cellArr = [];
  needs_redraw = true;
  loop();
}

function checkHover() {
  const buttons = [homeButton, resetButton];

  for (const button of buttons) {
    if (button.elt.matches(':hover')) {
      button.style('background-color', '#666666');
    } else {
      button.style('background-color', '#444444');
    }
  }
}

function windowResized() {
	
  background("#333437");
	resizeCanvas(windowWidth, windowHeight);
  //homeButton = null;
  
  needs_redraw = true;
	makeGamePage();
}