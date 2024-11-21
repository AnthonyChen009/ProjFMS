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
let possibleCells = [];
let sizeSetting = 60;

let easyButton;
let mediumButton;
let hardButton;

let selectedSetting = null;
//cell class
class Cell {
  constructor(x1, y1, size, color) {
    this.x1 = x1;
    this.y1 = y1;
    this.size = size;
    this.color = color
    this.topWallHidden = false;
    this.leftWallHidden = false;
    this.rightWallHidden = false;
    this.bottomWallHidden = false;
    this.visited = false;
    this.isFinalCell = false;
  }
  display() {
    noStroke();
    fill(this.color);
    rect(this.x1, this.y1, this.size, this.size);
    stroke('Black');
    strokeWeight(2);
    if (!this.topWallHidden) {
      line(this.x1, this.y1, this.x1 + this.size, this.y1);
    }
    if (!this.rightWallHidden) {
      line(this.x1 + this.size, this.y1, this.x1 + this.size, this.y1 + this.size);
    }
    if (!this.bottomWallHidden) {
      line(this.x1, this.y1 + this.size, this.x1 + this.size, this.y1 + this.size);
    }
    if (!this.leftWallHidden) {
      line(this.x1, this.y1, this.x1, this.y1 + this.size);
    }
  }
  getX1() {
    return this.x1;
  }
  getY1() {
    return this.y1;
  }

  getX1Rel() {
    return (this.x1 - (width / 2) + (300))/ this.size;
  }
  getY1Rel() {
    return (this.y1 + 60 - 110) / this.size;
  }

  changeColor(col){
    this.color = col;
    this.display();
  }
  breakWall(wall) {

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
	//only draw if needed
	if (needs_redraw) {
    
    resetText = true;
    homeButton = null;
    background("#333437");
    makeGamePage();
    if (selectedSetting == null) {
      changeDifficulty(0);
    }
		drawPanel()
    needs_redraw = false;
    prevCell = cellArr[0 * 420/sizeSetting + 0];
    possibleCells = getPossibleNeighbors(prevCell);
    
    noStroke();
    fill("white");
    text("Start at red square and drag to yellow", 20, height - 50);
    text("Do not stop holding left mouse button or you will need to restart", 20, height - 20);
  }
  checkRectHover();
	checkHover();
  selectedSetting.style('background-color', '#FFFFFF');
  
  
	if (!paused && started) {
		if (!mouseIsPressed) {
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
  for (let i = 0; i < 600/sizeSetting; i++) {
    for (let j = 0; j < 420/sizeSetting; j++) {
      let cell = cellArr[i * 420/sizeSetting + j];      

      if (mouseX >= cell.getX1() && mouseX <= cell.getX1() + sizeSetting && mouseY >= cell.getY1() && mouseY <= cell.getY1() + sizeSetting) {
        if (mouseIsPressed) {
          print(cell.getY1Rel());
          //only go to cell if the cell can be reached
          if(possibleCells.find(item => item === cell)) {
            if (!started) {
              startTime = millis();
            }
            started = true;
            prevCell.changeColor("red");
            prevCell = cell;
            possibleCells = getPossibleNeighbors(cell);
            cell.changeColor("green");
            
            //draw time box
            if (cell.isFinalCell) {
              fill("#444444");
              noStroke();
              rect((width/2) - (200/2), 560, 200, 50, 20);
              fill("white");
              currentTime = millis();
              text("Time: " + Math.floor((currentTime - startTime)/1000) + " sec",(width / 2) - 10 - (textWidth("Time " + Math.floor((currentTime - startTime)/1000) + " Sec")) / 2, 560 + 35);
              noLoop();
            }
          }
        }
      } 
    } 
  }  
}

function getPossibleNeighbors(cell){
  let CellsRtn = [];

  if (cell.topWallHidden) {
    CellsRtn.push(cellArr[cell.getX1Rel() * (420/sizeSetting) + cell.getY1Rel() - 1]);
  }
  if (cell.rightWallHidden) {
    CellsRtn.push(cellArr[(cell.getX1Rel() + 1) * (420/sizeSetting) + cell.getY1Rel()]);
  }
  if (cell.bottomWallHidden) {
    CellsRtn.push(cellArr[cell.getX1Rel() * (420/sizeSetting) + cell.getY1Rel() + 1]);
  }
  if (cell.leftWallHidden) {
    CellsRtn.push(cellArr[(cell.getX1Rel() - 1) * (420/sizeSetting) + cell.getY1Rel()]);
  }


  return CellsRtn;
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
  
  
  for (let x = 0; x < 600/sizeSetting; x++) {
    
    for (let y = 0; y < 420/sizeSetting; y++) {
      //fill("black");
      // changeCell(x, y, "Black");
      // noStroke();
      // rectColor.push("black");
      // rectx.push((width/2) - (600/2) + (60 * x));
      // recty.push(110 + (60 * y) - 60);
      let cell = new Cell((width/2) - (600/2) + (sizeSetting * x), 110 + (sizeSetting * y) - 60, sizeSetting , "white");
      cellArr.push(cell);
      cell.display();
    }
  }
  generateMaze();
  //draw rect to clear any drawing that may have happened so that it doesnt interfere
  drawRect();
  drawMaze();
  
}



function generateMaze() {
  let stack = [];
  let start = cellArr[0];
  stack.push(start);
  start.visited = true;
  start.changeColor("red");
  while(stack.length > 0) {
    let current = stack[stack.length - 1];
    let tmp = getUnvisitedNeighbors(current);
    
    if (tmp.length > 0) {
      let next = tmp[getRandomInt(0, tmp.length - 1)];
      //remove wall
      removeWall(current, next);
      next.visited = true;
      stack.push(next);
    }
    else {
      stack.pop();
    }
  }
  cellArr[cellArr.length - 1].changeColor("yellow");
  cellArr[cellArr.length - 1].isFinalCell = true;
}

function drawMaze() {
  for (let x = 0; x < 600/sizeSetting; x++) {
    for (let y = 0; y < 420/sizeSetting; y++) {
      cellArr[x * 420/sizeSetting + y].display();
    }
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function removeWall(currentCell, next) {
  // check direction

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
    
    if ((neighbor[0] >= 0 && neighbor[0] < 600/sizeSetting && neighbor[1] >= 0 && neighbor[1] < 420/sizeSetting)) {
      if (!cellArr[neighbor[0] * 420/sizeSetting + neighbor[1]].visited) {
        neighbors.push(cellArr[neighbor[0] * 420/sizeSetting + neighbor[1]]);

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
	
  easyButton = createButton('Easy');
  mediumButton = createButton('Medium');
  hardButton = createButton('Hard');

  resetButton = createButton("Reset");
  resetButton.position(width/2 - resetButton/2, 480);
  homeButton.position(width - homeButton.width - 50, 20);
  homeButton.mousePressed(goToHome);

  easyButton.mousePressed(() => changeDifficulty(0));
  mediumButton.mousePressed(() => changeDifficulty(1));
  hardButton.mousePressed(() => changeDifficulty(2));


  easyButton.position(width/2 - (easyButton.width/2) - ((easyButton.width + 8)), 20)
  easyButton.style('background-color', '#444444');
  easyButton.style('font-family', 'JetBrains Mono');
  easyButton.style('border', '5px');
  easyButton.style('border-radius', '5px');
  
  mediumButton.position(width/2 - (mediumButton.width/2), 20)
  mediumButton.style('background-color', '#444444');
  mediumButton.style('font-family', 'JetBrains Mono');
  mediumButton.style('border', '5px');
  mediumButton.style('border-radius', '5px');

  hardButton.position(width/2 - (hardButton.width/2) + (hardButton.width + 8), 20)
  hardButton.style('background-color', '#444444');
  hardButton.style('font-family', 'JetBrains Mono');
  hardButton.style('border', '5px');
  hardButton.style('border-radius', '5px');

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

function changeDifficulty(diff) {
  if (diff === 0) {
    print("Diff: " + diff);
    sizeSetting = 60;
    selectedSetting = easyButton;
  }
  if (diff === 1) {
    print("Diff: " + diff);
    sizeSetting = 30;
    selectedSetting = mediumButton;
  }
  if (diff === 2) {
    print("Diff: " + diff);
    sizeSetting = 15;
    selectedSetting = hardButton;
  }
  
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
  selectedSetting.style('background-color', '#FFFFFF');
  
}

function windowResized() {
	
  background("#333437");
	resizeCanvas(windowWidth, windowHeight);
  //homeButton = null;
  
  needs_redraw = true;
	makeGamePage();
}