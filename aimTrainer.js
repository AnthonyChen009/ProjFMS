let jetFont;
let count = 30;
let timeToHit = [];
let needs_redraw = true;
let homeButton;
let width;
let height;
let paused = false;
let started = false; 
let targetButton;
let startTime = 0;
let currentTime = 0;
let resetButton;

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
  targetButton = createButton('X');
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

  
  if (count <= 0) {
    return;
  }

  if (count % 2 == 0) {
    startTime = millis();
  }
  else {
    currentTime = millis();
    timeToHit.push(currentTime - startTime);
  }
  console.log(timeToHit);
	drawPanel();
  count--;

	let x = random((width/2) - (600/2) + 10, (width/2) - (600/2) + 540);
  let y = random(60, 395);
  targetButton.position(x, y);
  fill("#444444");
  rect((width/2) - (200/2), 500, 200, 50, 20);
  fill("white");
  text("Remaining: " + count,(width / 2) - (textWidth("Remaining: " + count)/2), 535);
  if (count <= 0) {
    let avg = 0;
    for (let i = 0; i < timeToHit.length; i++) {
      avg += timeToHit[i];
    }
    avg /= timeToHit.length;
    //noLoop();
    fill("#444444");
    rect((width/2) - (200/2), 560, 200, 50, 20);
    fill("white");
    text("Time: " + Math.floor(avg) + " ms",(width / 2) - (textWidth("Time " + (Math.floor(avg))  + " ms")) / 2, 560 + 35);
  }

}

function makeGamePage() {
  // Create the "Back to Home" button
	background("#333437");
  drawPanel();
  textSize(20);
  fill("white");
  text("Mouse Accuracy Game", 20, 40);
  homeButton = createButton('Back to Home');
	
	targetButton.position(width/2 - targetButton/2, 235);
  targetButton.mousePressed(gameLoop);
  resetButton = createButton("Reset");
  resetButton.position(width/2 - resetButton/2, 460);
  homeButton.position(width - homeButton.width - 50, 20);
  homeButton.mousePressed(goToHome);

  resetButton.mousePressed(reset);
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

  resetButton.style('background-color', '#444444');
  resetButton.style('border', '5px');
  resetButton.style('color', 'white');
  resetButton.style('padding', '5px 10px');
  resetButton.style('border-radius', '5px');
}

function windowResized() {
	
  background("#333437");
	resizeCanvas(windowWidth, windowHeight);
  //homeButton = null;
  
  needs_redraw = true;
	makeGamePage();
  
}

function goToHome() {
  window.location.href = 'index.html';
}

function reset(){
  count = 30;
  timeToHit = [];
  makeGamePage();
  targetButton.position((width/2) - (targetButton.width/2) - 10, 235);
  needs_redraw = true;
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
	if (targetButton.elt.matches(':hover')) {
		targetButton.style('background-color', '#fc0505');
	} else {
		targetButton.style('background-color', '#0ced4f');
	}
}