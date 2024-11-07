let jetFont;
let count = 20;
let timeToHit = 0;
let needs_redraw = true;
let homeButton;
let width;
let height;
let paused = false;
let started = false; 
let targetButton;

function preload() {
  //ubuntuFont = loadFont("Ubuntu-Regular.ttf");
  jetFont = loadFont("JetBrainsMono-Regular.ttf");
}

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
    
  }
	checkHover()
	if (!paused && started) {
		gameLoop();
	}
}

function drawPanel() {
	fill("#444444");
  noStroke();
	rect((width/2) - (600/2), 50, 600, 400, 20);
}

function gameLoop() {
	drawPanel();
	let x = random((width/2) - (600/2) + 10, (width/2) - (600/2) + 540);
}

function makeGamePage() {
  // Create the "Back to Home" button
	background("#333437");
  textSize(20);
  fill("white");
  text("Mouse Movement Game", 20, 40);
  homeButton = createButton('Back to Home');
	targetButton = createButton('X');
	targetButton.position(width/2 - targetButton/2, 240);
  homeButton.position(width - homeButton.width - 50, 20);
  homeButton.mousePressed(goToHome);
  // Optional styling
  homeButton.style('background-color', '#444444');
  homeButton.style('font-family', 'JetBrains Mono');
  homeButton.style('color', 'white');
  homeButton.style('padding', '10px 20px');
  homeButton.style('border', '5px');
  homeButton.style('border-radius', '5px');
	targetButton.style('border', '5px');
  targetButton.style('border-radius', '5px');
	targetButton.style('padding', '15px 20px');
	targetButton.style('background-color', '#0ced4f');
}

function windowResized() {
	
  background("#333437");
	resizeCanvas(windowWidth, windowHeight);
  //homeButton = null;
  
  needs_redraw = true;
	makeGamePage();
  
}

function clicked() {
	count--;
}

function goToHome() {
  window.location.href = 'index.html';
}

function checkHover() {
  const buttons = [homeButton];

  for (const button of buttons) {
    if (button.elt.matches(':hover')) {
      button.style('background-color', '#666666');
    } else {
      button.style('background-color', '#444444');
    }
  }
	if (targetButton.elt.matches(':hover')) {
		targetButton.style('background-color', '#fc0505');
	} else {
		targetButton.style('background-color', '#0ced4f');
	}
}