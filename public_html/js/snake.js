/*-----------------------------------------------------------------------------
 * Variables
 * ----------------------------------------------------------------------------
 */

var snake;
var snakeLength;
var snakeSize; 
var snakeDirection;

var food;

var context;
var screenWidth;
var screenHeight;

var gameState;
var startScreen;
var gameOverMenu;
var restartButton;
var menuButton;
var playHUD;
var scoreboard;
var speed;
var fast;
var slow;
var medium;

/*-----------------------------------------------------------------------------
 * Executing Game Code
 * ----------------------------------------------------------------------------
 */

gameInitialize();
snakeInitialize();
foodInitialize();
speed = setInterval(gameLoop, 1000 / 15);

/*-----------------------------------------------------------------------------
 * Game Functions
 * ----------------------------------------------------------------------------
 */

function gameInitialize() {
    var canvas = document.getElementById("game-screen");
    context = canvas.getContext("2d");

    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    canvas.width = screenWidth;
    canvas.height = screenHeight;

    document.addEventListener("keydown", keyboardHandler);
    
    startScreen = document.getElementById("startScreen");
    centerMenuPosition(startScreen);
    // start button
     startButton.addEventListener("click", gameStart);
    // easy difficulty
    easyButton = document.getElementById("easyButton");
    easyButton.addEventListener("click", easyDifficulty );
    // medium difficulty
    mediumButton = document.getElementById("mediumButton");
    mediumButton.addEventListener("click", mediumDifficulty );
    //hard difficulty
    hardButton = document.getElementById("hardButton");
    hardButton.addEventListener("click", gameStart , hardDifficulty);
    //game over menu
    gameOverMenu = document.getElementById("gameOver");
    centerMenuPosition(gameOverMenu);
    //restart the game
    restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", gameRestart);
    //go to start screen
    menuButton = document.getElementById("menuButton");
    menuButton.addEventListener("click" , mainMenu );
    
    
    
    //scoreboard
    playHUD = document.getElementById("playHUD");
    scoreboard = document.getElementById("scoreboard");

    setState("START");
}

function gameLoop() {
    gameDraw();
    drawScoreboard();
    if (gameState == "PLAY") {
        snakeUpdate();
        snakeDraw();
        foodDraw();
        hideMenu(startScreen);
    }
}

function gameDraw() {
    context.fillStyle = "deepskyblue";
    context.fillRect(0, 0, screenWidth, screenHeight);
}

function gameStart() {
    snakeInitialize();
    foodInitialize();
    setState("PLAY");
}

function gameRestart() { 
    snakeInitialize();
    foodInitialize();
    hideMenu(gameOverMenu);
    setState("PLAY");
}
function mainMenu() {
    setState("START");
    hideMenu(gameOverMenu);
}

function easyDifficulty() {
    clearInterval(fast);
    clearInterval(medium);
   // clearInterval(easy);
    clearInterval(speed);
  slow = setInterval(gameLoop, 80);
    gameStart();
    
}

function mediumDifficulty() {
    clearInterval(fast);
    clearInterval(medium);
    clearInterval(easy);
    clearInterval(speed);
  medium = setInterval(gameLoop, 60);
    gameStart();
    
}

function hardDifficulty() {
   // clearInterval(fast);
    clearInterval(medium);
    clearInterval(easy);
    clearInterval(speed);
   fast = setInterval(gameLoop, 35);
    gameStart();
}

/*-----------------------------------------------------------------------------
 * Snake Functions 
 * ----------------------------------------------------------------------------
 */

function snakeInitialize() {
    snake = [];
    snakeLength = 5;
    snakeSize = 18;
    snakeDirection = "right";

    for (var index = snakeLength - 1; index >= 0; index--) {
        snake.push({
            x: index,
            y: 0
        });
    }
}

function snakeDraw() {
    for (var index = 0; index < snake.length; index++) {
        context.fillStyle = "mediumspringgreen";
        context.fillRect(snake[index].x * snakeSize, snake[index].y * snakeSize, snakeSize, snakeSize);
    }
}

function snakeUpdate() {
    var snakeHeadX = snake[0].x;
    var snakeHeadY = snake[0].y;

    if (snakeDirection == "right") {
        snakeHeadX++;
    }
    else if (snakeDirection == "down") {
        snakeHeadY++;
    }

    else if (snakeDirection == "left") {
        snakeHeadX--;
    }

    else if (snakeDirection == "up") {
        snakeHeadY--;
    }

    checkFoodCollisions(snakeHeadX, snakeHeadY);
    checkWallCollisions(snakeHeadX, snakeHeadY);
    checkSnakeCollisions(snakeHeadX, snakeHeadY);

    var snakeTail = snake.pop();
    snakeTail.x = snakeHeadX;
    snakeTail.y = snakeHeadY;
    snake.unshift(snakeTail);
}

/*-----------------------------------------------------------------------------
 * Food Functions
 * ----------------------------------------------------------------------------
 */

function foodInitialize() {
    food = {
        x: 0,
        y: 0
    };
    setFoodPosition();
}

function foodDraw() {

    context.fillStyle = "crimson";
    context.fillRect(food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize);

}

function setFoodPosition() {
    var randomX = Math.floor(Math.random() * screenWidth);
    var randomY = Math.floor(Math.random() * screenHeight);

    food.x = Math.floor(randomX / snakeSize);
    food.y = Math.floor(randomY / snakeSize);
}
/*-----------------------------------------------------------------------------
 * Keyboard Functions
 * ----------------------------------------------------------------------------
 */
function keyboardHandler(event) {
    console.log(event);
    if (event.keyCode == "39" && snakeDirection != "left") {
        snakeDirection = "right";
    }//moving right//

    else if (event.keyCode == "40" && snakeDirection != "up") {
        snakeDirection = "down";
    }//moving down//

    else if (event.keyCode == "37" && snakeDirection != "right") {
        snakeDirection = "left";
    }//moving left//

    else if (event.keyCode == "38" && snakeDirection != "down") {
        snakeDirection = "up";
    }//moving up//

}

/* ----------------------------------------------------------------------------
 * Collision Handling
 * ----------------------------------------------------------------------------
 */
//when snake eats food//
function checkFoodCollisions(snakeHeadX, snakeHeadY) {
    if (snakeHeadX == food.x && snakeHeadY == food.y) {
        snake.push({
            x: 0,
            y: 0
        });
        snakeLength++;
        setFoodPosition();
    }
}
//when snake hits a wall//
function checkWallCollisions(snakeHeadX, snakeHeadY) {
    //wall collisions left and right//
    if (snakeHeadX * snakeSize >= screenWidth || snakeHeadX * snakeSize < 0) {
        console.log("Wall Collision");
        setState("GAME OVER");
    }
    //wall collisions up and down//
    if (snakeHeadY * snakeSize >= screenHeight || snakeHeadY * snakeSize < 0) {
        console.log("Wall Collision");
        setState("GAME OVER");
    }
}
//when snake head hits snake body//
function checkSnakeCollisions(snakeHeadX, snakeHeadY) {
    for (var index = 1; index < snake.length; index++) {
        if (snakeHeadX == snake[index].x && snakeHeadY == snake[index].y) {
            console.log("Snake Collision");
            setState("GAME OVER");
            return;
        }
    }
}
/*-----------------------------------------------------------------------------
 * Game State Handling
 * ----------------------------------------------------------------------------
 */

function setState(state) {
    gameState = state;
    showMenu(state);
}

/*-----------------------------------------------------------------------------
 * Menu functions
 * ----------------------------------------------------------------------------
 */

function displayMenu(menu) {
    menu.style.visibility = "visible";
}

function hideMenu(menu) {
    menu.style.visibility = "hidden";
}
//controls when to show the different menus//
function showMenu(state) {
    if(state == "GAME OVER") {
        displayMenu(gameOverMenu);
    }
    else if(state == "PLAY") {
        displayMenu(playHUD);
        
    }
    else if(state == "START"){
        displayMenu(startScreen);
    }
}

function centerMenuPosition(menu) {
    menu.style.top = (screenHeight / 2) - (menu.offsetHeight / 2) + "px";
    menu.style.left = (screenWidth / 2) - (menu.offsetWidth / 2) + "px";
}

function drawScoreboard() {
    scoreboard.innerHTML = "Length: " + snakeLength;
}