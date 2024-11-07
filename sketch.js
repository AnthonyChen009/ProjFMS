let width;
let height;
let needs_redraw = true;
let paused = false;
let homeButton;
let ubuntuFont;
let jetFont;
let words = [];
let characters = [];
let xpos = [];
let ypos = [];
let panel;
let word_count = 50;
let charX = 0;
let charY = 0;
let resetText = true;
let line_length = 0;
let rectVisible = true; 
let lastToggleTime = 0; 
let toggleInterval = 1000;
let currentX = 0;
let currentY = 0;
let is_typing = false;
let is_correct = [];
let num_correct_chars = [];
let targetTime = 10000;
let startTime;
let finished = false;
let game_started = false;
let num_correct = 0;
let time5;
let time10;
let time15;
let time20;
let time30;
let isTabPressed = false;
let isEnterPressed = false;
class character {
  constructor(x, y, size, color, letter, typed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.letter = letter;
    this.speed = 5; // speed of the character's movement
    this.typed = typed;
  }

  print() {
    text(this.letter, this.x, this.y);
  }

  change_typed(bool) {
    this.typed = bool;
  }

  change_color(new_col){
    this.color = new_col;
  }

  setpos(x, y){
    this.x = x;
    this.y = y;
  }
}

function preload() {
  //ubuntuFont = loadFont("Ubuntu-Regular.ttf");
  jetFont = loadFont("JetBrainsMono-Regular.ttf");
  for(let i = 0; i < word_count; i++) {
    words.push(generate_word());
  }
  
  for(let i = 0; i < word_count; i++) {
    for (let j = 0; j < words[i].length; j++) {
      characters.push(words[i].charAt(j));
    }
  }
  console.log("Finished");
}

function setup() {
  loadFont("JetBrainsMono-Regular.ttf", font => {
    textFont(font);
  });

  //textFont(jetFont);
  console.log(words);
  
  width = windowWidth;
  height = windowHeight;
  createCanvas(width, height);
  //make_home_page()
}

function draw() {

  if (needs_redraw) {
    resetText = true;
    homeButton = null;
    background("#333437");
    addTips();
    makeGamePage();
    make_window();
    statPanel();
    needs_redraw = false;
    
  }
  checkHover();
  //main loop
  if (!paused) {
  

    
    makeSolidCursor(xpos[currentX], ypos[currentY]);
    let elapsedTime;
    let remainingTime;

    let seconds;
    let minutes;
    let hours;

    let timeString;
    if (game_started) {
      finished = false;
      elapsedTime = millis() - startTime;
      remainingTime = targetTime - elapsedTime + 1000; 
      seconds = floor(remainingTime / 1000) % 60;
      minutes = floor(remainingTime / (1000 * 60)) % 60;
      hours = floor(remainingTime / (1000 * 60 * 60));
      timeString = hours.toString().padStart(2, '0') + ":" + 
                    minutes.toString().padStart(2, '0') + ":" + 
                    seconds.toString().padStart(2, '0');
    }
    else{
      //console.log("not started");
      startTime = millis();
      finished = true;
    }
    
    if (remainingTime > 2 && game_started) {
      fill("#333437");
      rect(width / 2 - 100, height / 2 - 50, 200, 100);
      textSize(32);
      fill("white");
      //textAlign(CENTER, CENTER);
      text(timeString, (width / 2) - (textWidth(timeString)/2) , height / 2);
    }

    if (floor(remainingTime / 1000) % 60 < 1) {
      // Handle timer completion here, e.g., display a message
      textSize(24);
      finished = true;
      game_started = false;
      text("Time's up!", width / 2 - (textWidth("Time's up!")/2), height / 2 + 50);
      console.log("Calulating...");
      calculateScore();
      statPanel()
      paused = true;
    }
  }
  
  
}

function calculateScore() {
  let charCount = !is_correct.length? 0 : is_correct.length;
  let time = targetTime / 1000;
  let words = charCount/4.7;
  let wpm = (words/time) * 60;
  return wpm;
}

function addTips() {
  textSize(20);
  fill("white");
  text("Press Enter to Reset Text When not typing", 20, height - 50);
  text("Press Shift + Enter to Restart", 20, height - 20);
}

function checkHover() {
  const buttons = [homeButton, time5, time10, time15, time20, time30];

  for (const button of buttons) {
    if (button.elt.matches(':hover')) {
      button.style('background-color', '#666666');
    } else {
      button.style('background-color', '#444444');
    }
  }
}

function keyPressed() {
  // Check if the pressed key is a letter (a-z or A-Z)
  if (keyCode === SHIFT) {
    isTabPressed = true;
  } else if (keyCode === ENTER) {
    isEnterPressed = true;
  }
  if (isTabPressed && isEnterPressed) {
    resetSketch();
  }
  is_typing = true;
  if (key.length === 1 && key.match(/[a-zA-Z]/) && !finished) {
    console.log("asd");
    console.log(currentX);
    resetText = true;
    make_window();
    //rect(xpos[currentX] - 2, ypos[currentY] - 25, 2, 30);
    if (key.match(characters[currentX])) {
      fill("white");
      text(characters[currentX], xpos[currentX], ypos[currentY]);
      is_correct.push(true);
    }
    else{
      fill("red");
      text(characters[currentX], xpos[currentX], ypos[currentY]);
      is_correct.push(false);
    }
    for (let i = 0; i < currentX; i++) {
      if (is_correct[i]) {
        fill("white");
        text(characters[i], xpos[i], ypos[i]);
        
        
      }
      else{
        fill("red");
        text(characters[i], xpos[i], ypos[i]);
        
      }
    }

    currentX++;
    currentY++;
    
  }
  else {
    console.log("Not a letter key");
  }
  if (keyCode === ENTER && !isTabPressed) {
    game_started = true;
    finished = false;
  }
  if (keyCode === BACKSPACE && finished && !game_started) {
    resetWords();
  }
  
  setTimeout(() => {
    is_typing = false;
  }, 3000);
}

function drawPanel() {
  
  panel = rect((width/2) - (windowWidth/4) - 100, 100, windowWidth/2 + 200, 260, 20);
}



function makeGamePage() {
  // Create the "Back to Home" button
  textSize(20);
  fill("white");
  text("Keyboard Typing Game", 20, 40);
  homeButton = createButton('Back to Home');
  homeButton.position(width - homeButton.width - 50, 20);
  homeButton.mousePressed(goToHome);
  time5 = createButton('5 Sec');
  time10 = createButton('10 Sec');
  time15 = createButton('15 Sec');
  time20 = createButton('20 Sec');
  time30 = createButton('30 Sec');


  time5.mousePressed(() => setTime(5));
  time10.mousePressed(() => setTime(10));
  time15.mousePressed(() => setTime(15));
  time20.mousePressed(() => setTime(20));
  time30.mousePressed(() => setTime(30));

  time5.position(width/2 - (time5.width/2) - (time5.width + 20 + time10.width), 25)
  time5.style('background-color', '#444444');
  time5.style('font-family', 'JetBrains Mono');
  time5.style('border', '5px');
  time5.style('border-radius', '5px');
  
  time10.position(width/2 - (time10.width/2) - ((time10.width + 8)), 25)
  time10.style('background-color', '#444444');
  time10.style('font-family', 'JetBrains Mono');
  time10.style('border', '5px');
  time10.style('border-radius', '5px');
  
  time15.position(width/2 - (time15.width/2), 25)
  time15.style('background-color', '#444444');
  time15.style('font-family', 'JetBrains Mono');
  time15.style('border', '5px');
  time15.style('border-radius', '5px');

  time20.position(width/2 - (time20.width/2) + (time15.width + 8), 25)
  time20.style('background-color', '#444444');
  time20.style('font-family', 'JetBrains Mono');
  time20.style('border', '5px');
  time20.style('border-radius', '5px');

  time30.position(time20.x + time30.width + 8, 25)
  time30.style('background-color', '#444444');
  time30.style('font-family', 'JetBrains Mono');
  time30.style('border', '5px');
  time30.style('border-radius', '5px');

  // Optional styling
  homeButton.style('background-color', '#444444');
  homeButton.style('font-family', 'JetBrains Mono');
  homeButton.style('color', 'white');
  homeButton.style('padding', '10px 20px');
  homeButton.style('border', '5px');
  homeButton.style('border-radius', '5px');
}

function setTime(sec) {
  targetTime = sec * 1000;
}

function make_window() {
  fill("#444444");
  noStroke();
  line_length = 0;
  drawPanel()
  if (resetText) {
    charX = ((width/2) - (windowWidth/4) - 100) + 20;
    charY = 100 + 40;
    
    for(let i = 0; i < word_count; i++) {
      
      if (line_length >= windowWidth/2 + 200 - 170) {
        charY += 40;
        charX = ((width/2) - (windowWidth/4) - 100) + 20;
        line_length = 0;
      }
      for (let j = 0; j < words[i].length; j++) {
        fill("#656669");
        textSize(30);
        textFont(jetFont);
        text(words[i].charAt(j), charX, charY);
        xpos.push(charX);
        ypos.push(charY);
        charX += textWidth(words[i].charAt(j)) ;
        line_length += textWidth(words[i].charAt(j)) ;
      }
      charX += 15;
      line_length += 15;
    }
    resetText = false;
  }
  
}

function goToHome() {
  window.location.href = 'index.html';
}

function statPanel() {
  let wpm = 0;
  if (is_correct.length) {
    wpm = Math.round(calculateScore());
  }
  let keysMissed = calcMissedKeys();
  textSize(25);
  fill("#444444");
  rect((width/2) - (windowWidth/4), 550, windowWidth/2, 200, 20);
  fill("White");
  text("WPM: " + str(wpm), (width/2) - (windowWidth/4) + 20, 550 + 50);
  text("Frequently Missed:", (width/2) - (windowWidth/4) + 20, 550 + 50 + 35);
  text(keysMissed, (width/2) - (textWidth(keysMissed)/2) - 20, 550 + 50 + 35 + 40);
}

function calcMissedKeys() {

  let missed = [];
  const frequencyMap = {};
  let rtn = [];
  for (let i = 0; i < is_correct.length; i++) {
    if (!is_correct[i]) {
      missed.push(characters[i]);
    }
  }

  for (const element of missed) {
    frequencyMap[element] = (frequencyMap[element] || 0) + 1;

    if (frequencyMap[element] >= 3 && !rtn.includes(element)) {
      rtn.push(element);
    }
  }

  return rtn || "None";
}

function resetWords() {
  is_correct = [];
  words = [];
  characters = [];
  xpos = [];
  ypos = [];
  for(let i = 0; i < word_count; i++) {
    words.push(generate_word());
  }
  
  for(let i = 0; i < word_count; i++) {
    for (let j = 0; j < words[i].length; j++) {
      characters.push(words[i].charAt(j));
    }
  }
  needs_redraw = true;
  resetText = true;
  console.log("Finished");
}

function keyReleased() {
  if (keyCode === SHIFT) {
    isTabPressed = false;
  } else if (keyCode === ENTER) {
    isEnterPressed = false;
  }
}

function resetSketch() {
  resetText = true;
  homeButton = null;
  game_started = false;
  paused = false;
  finished = true;
  currentX = 0;
  currentY = 0
  background("#333437");
  resetWords()
  makeGamePage();
  needs_redraw = true;
  make_window();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resetText = true;
  homeButton = null;
  background("#333437");
  makeGamePage();
  needs_redraw = true;
  make_window();
}

function makeCursor(x, y){
  if (int(frameCount / 60) % 2 === 0){
    noStroke();
    fill("white");
    rect(x - 2, y - 25, 2, 30);
  }
  else{
    noStroke();
    fill("#444444");
    rect(x - 2, y - 25, 2, 30);
  }
}

function makeSolidCursor(x, y){
  noStroke();
  fill("white");
  rect(x - 2, y - 25, 2, 30);
}

function generate_word() {
  const typingWords = [
    'apple', 'banana', 'car', 'dog', 'elephant', 'flower', 'grape', 'house', 'island', 'jump',
    'kite', 'lion', 'monkey', 'nest', 'orange', 'peach', 'quilt', 'rabbit', 'sun', 'tree',
    'umbrella', 'violet', 'wind', 'yellow', 'zebra', 'ant', 'ball', 'cat', 'dance',
    'ear', 'fish', 'goat', 'hat', 'ink', 'jungle', 'key', 'leaf', 'moon', 'night', 'owl', 'pen',
    'quick', 'rain', 'star', 'turtle', 'unicorn', 'volcano', 'whale', 'yarn', 'zoo',
    'air', 'boat', 'cake', 'duck', 'echo', 'flame', 'glove', 'hero', 'ice', 'jelly', 'kangaroo',
    'lake', 'mango', 'ocean', 'piano', 'quiz', 'rocket', 'snow', 'train', 'up', 'wall',
    'zone', 'bird', 'cow', 'dream', 'echo', 'fire', 'green', 'hill', 'ice', 'jar', 'key',
    'lime', 'moon', 'nest', 'open', 'pear', 'queen', 'rose', 'star', 'top', 'vase', 'water',
    'yellow', 'zip', 'adventure', 'book', 'chocolate', 'dragon', 'elephant', 'flame', 'guitar', 'harp', 'ink',
    'jellyfish', 'koala', 'lemon', 'mountain', 'net', 'octopus', 'penguin', 'queen', 'rose', 'strawberry', 'train',
    'umbrella', 'vacuum', 'wall', 'xylophone', 'yoga', 'zombie', 'alien', 'butterfly', 'cloud', 'dream',
    'electric', 'flame', 'giraffe', 'heart', 'idea', 'jasmine', 'kite', 'lamp', 'moonlight', 'needle', 'oak',
    'planet', 'quilt', 'rainbow', 'storm', 'tornado', 'vacuum', 'whale', 'x-ray', 'zebra', 'airplane',
    'book', 'cat', 'dog', 'egg', 'fish', 'gorilla', 'hat', 'igloo', 'jacket', 'kitchen', 'light', 'moon',
    'net', 'open', 'park', 'quilt', 'rose', 'sun', 'time', 'umbrella', 'village', 'web', 'xylophone',
    'yellow', 'zebra', 'apple', 'boat', 'car', 'dog', 'elephant', 'frog', 'guitar', 'hamster', 'island',
    'jump', 'kiwi', 'lion', 'mountain', 'nest', 'orange', 'pencil', 'quilt', 'rabbit', 'sunshine', 'tree',
    'umbrella', 'vulture', 'whale', 'xenon', 'yarn', 'zebra', 'air', 'bat', 'cake', 'duck', 'elephant',
    'fish', 'goat', 'hat', 'igloo', 'jungle', 'key', 'lamp', 'mountain', 'night', 'octopus', 'pen', 'quick',
    'rose', 'sun', 'tree', 'unicorn', 'vulture', 'whale', 'xenon', 'yellow', 'zebra', 'ant', 'ball', 'cat',
    'dog', 'elephant', 'flame', 'goat', 'harp', 'ice', 'jelly', 'kangaroo', 'leaf', 'monkey', 'noodles',
    'orange', 'peach', 'quick', 'river', 'stone', 'turtle', 'underwater', 'volcano', 'wind', 'yellow',
    'zebra', 'avocado', 'bicycle', 'cloud', 'dolphin', 'elephant', 'fountain', 'giraffe', 'harp', 'ink',
    'jungle', 'kiwi', 'lighthouse', 'moon', 'ninja', 'octopus', 'pen', 'quilt', 'rose', 'snow', 'tiger',
    'universe', 'vacuum', 'whale', 'xylophone', 'yarn', 'zebra', 'air', 'balloon', 'cloud', 'dog', 'elephant',
    'flame', 'guitar', 'hat', 'igloo', 'jungle', 'key', 'lighthouse', 'monkey', 'nest', 'octopus', 'penguin',
    'quick', 'rose', 'star', 'sun', 'turtle', 'up', 'vulture', 'whale', 'xylophone', 'yarn', 'zebra', 'airplane',
    'banana', 'cat', 'dog', 'elephant', 'fox', 'grape', 'hat', 'ink', 'jellyfish', 'kangaroo', 'lemon', 'mouse',
    'newt', 'orange', 'parrot', 'quilt', 'rose', 'sunflower', 'tree', 'underwater', 'violet', 'whale', 'xenon',
    'yellow', 'zebra', 'apple', 'boat', 'cake', 'dog', 'elephant', 'fire', 'goat', 'hat', 'ice', 'jellybean',
    'kangaroo', 'leaf', 'monkey', 'nest', 'orange', 'peach', 'quilt', 'rainbow', 'sun', 'tree', 'unicorn',
    'vulture', 'whale', 'x-ray', 'yellow', 'zebra', 'angel', 'ball', 'cat', 'dog', 'elephant', 'fish', 'goat',
    'hat', 'ink', 'jungle', 'kiwi', 'lighthouse', 'moon', 'night', 'orange', 'penguin', 'queen', 'rose',
    'snow', 'train', 'underwater', 'violet', 'whale', 'xylophone', 'yarn', 'zebra', 'air', 'ball', 'car',
    'dog', 'elephant', 'fox', 'grape', 'hat', 'ice', 'jar', 'kangaroo', 'lime', 'monkey', 'nest', 'octopus',
    'pencil', 'quick', 'rose', 'star', 'turtle', 'umbrella', 'vulture', 'whale', 'xylophone', 'yellow', 'zebra',
    'avocado', 'balloon', 'cloud', 'dog', 'elephant', 'flame', 'guitar', 'hat', 'ink', 'jungle', 'key', 'lemon',
    'moon', 'nest', 'open', 'pencil', 'quilt', 'rainbow', 'sun', 'tree', 'unicorn', 'violet', 'whale', 'xenon',
    'yellow', 'zebra', 'airplane', 'banana', 'cake', 'dog', 'elephant', 'flame', 'goat', 'hat', 'ice', 'jellyfish',
    'kangaroo', 'lemon', 'moon', 'nest', 'open', 'pencil', 'queen', 'rose', 'snow', 'train', 'underwater', 'violet',
    'whale', 'xylophone', 'yarn', 'zebra', 'avocado', 'ball', 'car', 'dog', 'elephant', 'fox', 'goat', 'hat',
    'ink', 'jungle', 'key', 'lamp', 'moon', 'nest', 'open', 'park', 'quick', 'rose', 'star', 'turtle', 'umbrella',
    'vulture', 'whale', 'xenon', 'yellow', 'zebra', 'airplane', 'boat', 'cake', 'dog', 'elephant', 'flame', 'goat',
    'hat', 'ice', 'jelly', 'kangaroo', 'lamp', 'moon', 'nest', 'octopus', 'penguin', 'quick', 'rose', 'snow',
    'train', 'underwater', 'violet', 'whale', 'xylophone', 'yarn', 'zebra', 'air', 'ball', 'car', 'dog', 'elephant',
    'flower', 'goat', 'hat', 'ice', 'jellyfish', 'kangaroo', 'leaf', 'monkey', 'night', 'octopus', 'penguin',
    'quilt', 'rose', 'snow', 'turtle', 'up', 'violet', 'whale', 'xenon', 'yellow', 'zebra', 'avocado', 'balloon',
    'cloud', 'dog', 'elephant', 'guitar', 'hat', 'ink', 'jungle', 'kiwi', 'lemon', 'moon', 'nest', 'octopus'
  ];
  let randomIndex = floor(random(0, typingWords.length - 1));  // Random index
  return typingWords[randomIndex];
}