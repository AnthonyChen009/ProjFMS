let jetFont;
let count = 15;
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
let averageTimes = [];

let easyButton;
let mediumButton;
let hardButton;

let selectedSetting;
let savedTarget;

function preload() {
  //ubuntuFont = loadFont("Ubuntu-Regular.ttf");
  jetFont = loadFont("JetBrainsMono-Regular.ttf");
}

function setup() {
	loadFont("JetBrainsMono-Regular.ttf", font => {
    textFont(font);
  });
  loadAverageTimes();
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
		drawPanel();
    top5Times();
    needs_redraw = false;
    if (selectedSetting == null) {
      selectedSetting = mediumButton;
      savedTarget = 20;
    }
    
  }
	checkHover()
	
}

function saveAverageTimes() {
  localStorage.setItem("averageTimes", JSON.stringify(averageTimes));
  console.log("averageTimes saved!");
}

function loadAverageTimes() {
  const savedTimes = localStorage.getItem("averageTimes");

  if (savedTimes) {
    averageTimes = JSON.parse(savedTimes);
    console.log("averageTimes loaded:", averageTimes);
  } else {
    console.log("No saved averageTimes found.");
  }
}


function drawPanel() {
	fill("#444444");
  noStroke();
	rect((width/2) - (600/2), 50, 600, 400, 20);
}

function top5Times(){
  print("e")
  print(averageTimes)
  fill("#444444");
  noStroke();
  rect(20, 70, 250, 600, 20);
  fill("white");
  text("Top 5 Times:", 40, 100);
  for (let i = 0; i < 5; i++) {
    if (averageTimes.length != 0 && i < averageTimes.length) {
      text(i + ".) " + averageTimes[i] + " ms", 40, 100 + 30 + (30 * i));
      print("w")
    }
    else{
      text((i + 1) + ".) ", 40, 100 + 30 + (30 * i));
    } 
  }
}

function gameLoop() {

  started = true;
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
    started = false;
    let avg = 0;
    for (let i = 0; i < timeToHit.length; i++) {
      avg += timeToHit[i];
    }
    avg /= timeToHit.length;
    if (averageTimes.length < 5) {
      averageTimes.push(Math.floor(avg));
      averageTimes.sort((a, b) => b - a);
    }
    else {
      //remove 
      removeLargest(averageTimes);
      averageTimes.push(Math.floor(avg));
      averageTimes.sort((a, b) => a - b);
    }
    //noLoop();
    fill("#444444");
    rect((width/2) - (200/2), 560, 200, 50, 20);
    fill("white");
    
    
    text("Time: " + Math.floor(avg) + " ms",(width / 2) - (textWidth("Time " + (Math.floor(avg))  + " ms")) / 2, 560 + 35);
    top5Times();
  }

}

function removeLargest(arr) {
  const max = Math.max(...arr);
  const index = arr.indexOf(max);
  if (index > -1) {
      arr.splice(index, 1);
  }
  return arr;
}

function makeGamePage() {
  // Create the "Back to Home" button
	background("#333437");
  drawPanel();
  textSize(20);
  fill("white");
  text("Mouse Accuracy Game", 20, 40);
  homeButton = createButton('Back to Home');
	
  if (easyButton == null) {
    easyButton = createButton('10 Targets');
    mediumButton = createButton('20 Targets');
    hardButton = createButton('30 Targets');

    easyButton.position(width/2 - (easyButton.width/2) - ((easyButton.width + 8)) - 10, 20)
    easyButton.style('background-color', '#444444');
    easyButton.style('font-family', 'JetBrains Mono');
    easyButton.style('border', '5px');
    easyButton.style('border-radius', '5px');
    
    mediumButton.position(width/2 - (mediumButton.width/2), 20)
    mediumButton.style('background-color', '#444444');
    mediumButton.style('font-family', 'JetBrains Mono');
    mediumButton.style('border', '5px');
    mediumButton.style('border-radius', '5px');

    hardButton.position(width/2 - (hardButton.width/2) + (hardButton.width + 8) + 8, 20)
    hardButton.style('background-color', '#444444');
    hardButton.style('font-family', 'JetBrains Mono');
    hardButton.style('border', '5px');
    hardButton.style('border-radius', '5px');

    easyButton.mousePressed(() => changeDifficulty(10, easyButton));
    mediumButton.mousePressed(() => changeDifficulty(20, mediumButton));
    hardButton.mousePressed(() => changeDifficulty(30, hardButton));

  }

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

function changeDifficulty(num, button) {
  if (!started) {
    selectedSetting = button;
    count = num;
    savedTarget = num;
  }
}

function windowResized() {
	
  background("#333437");
	resizeCanvas(windowWidth, windowHeight);
  //homeButton = null;
  
  needs_redraw = true;
	makeGamePage();
  
}

function goToHome() {
  saveAverageTimes();
  window.location.href = 'index.html';

}

function reset(){
  print(savedTarget)
  started = false;
  timeToHit = [];
  makeGamePage();
  targetButton.position((width/2) - (targetButton.width/2) - 10, 235);
  count = savedTarget;
  needs_redraw = true;
}

function checkHover() {
  const buttons = [homeButton, resetButton, easyButton, mediumButton, hardButton];

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

  selectedSetting.style('background-color', '#ffffff');
}