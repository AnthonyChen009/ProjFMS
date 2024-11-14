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
let canReset = true;
let endEarly = false;
let timeLeft = 0;

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
      canReset = false;
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

    if ((floor(remainingTime / 1000) % 60 < 1) || endEarly) {
      // Handle timer completion here, e.g., display a message
      timeLeft = targetTime - remainingTime;
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
  let time = timeLeft / 1000;
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

    if (currentX < characters.length) {
      
      currentX++;
      currentY++;
    }
    else{
      endEarly = true;
    }
    
  }
  else {
    console.log("Not a letter key");
  }
  if (keyCode === ENTER && !isTabPressed) {
    game_started = true;
    finished = false;
  }
  if (keyCode === BACKSPACE && finished && !game_started && canReset) {
    resetWords();
  }
  else if (keyCode === BACKSPACE && !finished && game_started && !canReset) {
    if (currentX > 0) {
      is_correct.pop();
      currentX--;
      currentY--;
    }
    resetText = true;
    make_window();

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
  let count = 0;
  let result = 0;
  if (is_correct.length) {
    wpm = Math.round(calculateScore());
    count = is_correct.filter(item => item === false).length;
    result = ((is_correct.length - count) / is_correct.length) * 100;
  }
  let keysMissed = calcMissedKeys();

  textSize(25);
  fill("#444444");
  rect((width/2) - (windowWidth/4), 550, windowWidth/2, 200, 20);
  fill("White");
  text("WPM: " + str(wpm), (width/2) - (windowWidth/4) + 20, 550 + 50);
  text("Frequently Missed: " + keysMissed, (width/2) - (windowWidth/4) + 20, 550 + 50 + 35);
  text("Accuracy: " + (result) + "%", (width/2) - (windowWidth/4) + 20, 550 + 50 + 35 + 35);
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
  endEarly = false;
  canReset = true;
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
  resetWords();
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

function makeSolidCursor(x, y){
  noStroke();
  fill("white");
  rect(x - 2, y - 25, 2, 30);
}

function generate_word() {
  const typingWords = [
    "apple", "banana", "orange", "grape", "pear",
    "cat", "dog", "bird", "fish", "frog",
    "red", "green", "blue", "yellow", "purple",
    "happy", "sad", "angry", "excited", "calm",
    "run", "jump", "walk", "swim", "fly",
    "hot", "cold", "warm", "cool", "freezing",
    "big", "small", "tall", "short", "long",
    "fast", "slow", "quick", "easy", "hard",
    "good", "bad", "nice", "mean", "kind",
    "love", "hate", "like", "dislike", "care",
    "house", "car", "boat", "plane", "train",
    "book", "pen", "pencil", "paper", "notebook",
    "sun", "moon", "star", "cloud", "rain",
    "tree", "flower", "grass", "leaf", "root",
    "mountain", "hill", "valley", "river", "lake",
    "city", "town", "village", "street", "road",
    "work", "play", "sleep", "eat", "drink",
    "read", "write", "speak", "listen", "think",
    "smile", "laugh", "cry", "shout", "whisper",
    "kind", "cruel", "honest", "dishonest", "fair",
    "strong", "weak", "fast", "slow", "healthy",
    "smart", "stupid", "clever", "silly", "funny",
    "quiet", "loud", "noisy", "silent", "still",
    "clean", "dirty", "wet", "dry", "hot",
    "cold", "warm", "cool", "freezing", "boiling",
    "light", "dark", "bright", "dim", "dull",
    "early", "late", "fast", "slow", "quick",
    "easy", "hard", "simple", "complex", "difficult",
    "possible", "impossible", "probable", "improbable", "certain",
    "true", "false", "right", "wrong", "correct",
    "beautiful", "ugly", "pretty", "plain", "handsome",
    "young", "old", "new", "modern",
    "big", "small", "large", "tiny", "huge",
    "tall", "short", "high", "low", "deep",
    "wide", "narrow", "thick", "thin", "long",
    "heavy", "light", "strong", "weak", "tough",
    "soft", "hard", "smooth", "rough", "sharp",
    "sweet", "sour", "bitter", "salty", "spicy",
    "loud", "quiet", "noisy", "silent", "still",
    "fast", "slow", "quick", "easy", "hard",
    "good", "bad", "nice", "mean", "kind",
    "happy", "sad", "angry", "excited", "calm",
    "love", "hate", "like", "dislike", "care",
    "hope", "fear", "worry", "doubt", "believe",
    "know", "understand", "learn", "teach", "study",
    "speak", "listen", "write", "read", "think",
    "work", "play", "sleep", "eat", "drink",
    "run", "jump", "walk", "swim", "fly",
    "climb", "crawl", "stand", "sit", "lie",
    "push", "pull", "lift", "carry", "drop",
    "open", "close", "turn", "twist", "bend",
    "break", "fix", "build", "create", "destroy",
    "buy", "sell", "spend", "save", "borrow",
    "give", "take", "lend", "keep", "lose",
    "find", "look", "see", "hear", "feel",
    "smell", "taste", "touch", "sense", "perceive",
    "think", "imagine", "dream", "remember", "forget",
    "believe", "doubt", "hope", "fear", "worry",
    "love", "hate", "like", "dislike", "care",
    "kind", "cruel", "honest", "dishonest", "fair",
    "strong", "weak", "fast", "slow", "healthy",
    "smart", "stupid", "clever", "silly", "funny",
    "quiet", "loud", "noisy", "silent", "still",
    "clean", "dirty", "wet", "dry", "hot",
    "cold", "warm", "cool", "freezing", "boiling",
    "light", "dark", "bright", "dim", "dull",
    "early", "late", "fast", "slow", "quick",
    "easy", "hard", "simple", "complex", "difficult",
    "possible", "impossible", "probable", "improbable", "certain",
    "true", "false", "right", "wrong", "correct",
    "beautiful", "ugly", "pretty", "plain", "handsome",
    "young", "old", "new", "modern",
    "big", "small", "large", "tiny", "huge",
    "tall", "short", "high", "low", "deep",
    "wide", "narrow", "thick", "thin", "long",
    "heavy", "light", "strong", "weak", "tough",
    "soft", "hard", "smooth", "rough", "sharp",
    "sweet", "sour", "bitter", "salty", "spicy",
    "loud", "quiet", "noisy", "silent", "still",
    "fast", "slow", "quick", "easy", "hard",
    "good", "bad", "nice", "mean", "kind",
    "happy", "sad", "angry", "excited", "calm",
    "love", "hate", "like", "dislike", "care",
    "hope", "fear", "worry", "doubt", "believe",
    "know", "understand", "learn", "teach", "study",
    "speak", "listen", "write", "read", "think",
    "work", "play", "sleep", "eat", "drink",
    "run", "jump", "walk", "swim", "fly",
    "climb", "crawl", "stand", "sit", "lie",
    "push", "pull", "lift", "carry", "drop",
    "open", "close", "turn", "twist", "bend",
    "break", "fix", "build", "create", "destroy",
    "buy", "sell", "spend", "save", "borrow",
    "give", "take", "lend", "keep", "lose",
    "find", "look", "see", "hear", "feel",
    "smell", "taste", "touch", "sense", "perceive",
    "think", "imagine", "dream", "remember", "forget",
    "believe", "doubt", "hope", "fear", "worry",
    "love", "hate", "like", "dislike", "care",
    "kind", "cruel", "honest", "dishonest", "fair",
    "strong", "weak", "fast", "slow", "healthy",
    "smart", "stupid", "clever", "silly", "funny",
    "quiet", "loud", "noisy", "silent", "still",
    "clean", "dirty", "wet", "dry", "hot",
    "cold", "warm", "cool", "freezing", "boiling",
    "light", "dark", "bright", "dim", "dull",
    "early", "late", "fast", "slow", "quick",
    "easy", "hard", "simple", "complex", "difficult",
    "possible", "impossible", "probable", "improbable", "certain",
    "true", "false", "right", "wrong", "correct",
    "beautiful", "ugly", "pretty", "plain", "handsome",
    "young", "old", "new", "modern",
    "big", "small", "large", "tiny", "huge",
    "tall", "short", "high", "low", "deep",
    "wide", "narrow", "thick", "thin", "long",
    "heavy", "light", "strong", "weak", "tough",
    "soft", "hard", "smooth", "rough", "sharp",
    "sweet", "sour", "bitter", "salty", "spicy"
  ];
  let randomIndex = floor(random(0, typingWords.length - 1));  // Random index
  return typingWords[randomIndex];
}