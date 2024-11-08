let width;
let height;
let needs_redraw = true;
let homeButton;
let resetButton;
let paused = false;
let started = false;


function setup() {
  loadFont("JetBrainsMono-Regular.ttf", font => {
    textFont(font);
  });
  width = windowWidth;
  height = windowHeight;
  createCanvas(width, height);
  //targetButton = createButton('X');
}

function draw() {
	
	if (needs_redraw) {
    resetText = true;
    homeButton = null;
    background("#333437");
    makeGamePage();
		drawPanel()
    needs_redraw = false;
    
  }
	checkHover()
	if (!paused && started) {
		
	}
}

function drawPanel() {
	fill("#444444");
  stroke('white');
	rect((width/2) - (600/2), 50, 600, 420, 0);
  stroke('white');
  strokeWeight(2);
  for (let i = 1; i < 10; i++) {
    
    line((width/2) - (600/2) + (60 * i), 51, (width/2) - (600/2) + (60 * i), 469);
  }

  for (let j = 0; j < 6; j++) {
    line((width/2) - (600/2) + 1, 110 + (60 * j), (width/2) + (600/2) - 1, 110 + (60 * j));
  }
  
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 7; y++) {
      //fill("black");
      changeCell(x, y, "Black");
    }
  }
}

function changeCell(x, y, color) {
  fill(color);
  rect((width/2) - (600/2) + (60 * x), 110 + (60 * y) - 60, 60, 60);
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

  resetButton.mousePressed( );
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