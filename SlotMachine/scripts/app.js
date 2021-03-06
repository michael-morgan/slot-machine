﻿/**
* app.ts
* Name: Michael Morgan
* Last Modified By: Micael Morgan
* Last Modified: October 29th, 2014
* app.ts handles all of the slot machines functionality at run-time
* Revision: 1.8
*/
/* local variable declarations */
var stage;

var playerCash = 0, playerBet = 0, playerBet = 0;
var jackpot = 0, winnings = 0;
var winNumber = 0, lossNumber = 0, winRatio = 0;
var spinResult;

var MAX_BET = 25;

var canvasBackgroundImage = new createjs.Bitmap("./images/canvas_background.jpg"), slotMachineImage = new createjs.Bitmap("./images/slot_machine_template.jpg"), resetImage = new createjs.Bitmap("./images/button_reset.jpg"), resetHoverImage = new createjs.Bitmap("./images/button_reset_hover.jpg"), betOneImage = new createjs.Bitmap("./images/button_bet_one.jpg"), betOneHoverImage = new createjs.Bitmap("./images/button_bet_one_hover.jpg"), betMaxImage = new createjs.Bitmap("./images/button_bet_max.jpg"), betMaxHoverImage = new createjs.Bitmap("./images/button_bet_max_hover.jpg"), spinImage = new createjs.Bitmap("./images/button_spin.jpg"), spinHoverImage = new createjs.Bitmap("./images/button_spin_hover.jpg"), logoutHoverImage = new createjs.Bitmap("./images/logout_hover.jpg"), logoutAreaImage = new createjs.Bitmap("./images/logout_area.png"), fullResetHoverImage = new createjs.Bitmap("./images/reset_hover.jpg"), fullResetAreaImage = new createjs.Bitmap("./images/reset_area.png");

var blank = 0;
var blankImage = new Image();
blankImage.src = "./images/blank_icon.jpg";
var bar = 0;
var barImage = new Image();
barImage.src = "./images/bar_icon.jpg";
var grape = 0;
var grapeImage = new Image();
grapeImage.src = "./images/grape_icon.jpg";
var bell = 0;
var bellImage = new Image();
bellImage.src = "./images/bell_icon.jpg";
var banana = 0;
var bananaImage = new Image();
bananaImage.src = "./images/banana_icon.jpg";
var cherry = 0;
var cherryImage = new Image();
cherryImage.src = "./images/cherry_icon.jpg";
var orange = 0;
var orangeImage = new Image();
orangeImage.src = "./images/orange_icon.jpg";
var seven = 0;
var sevenImage = new Image();
sevenImage.src = "./images/seven_icon.jpg";

var playerBetText = new createjs.Text("" + playerBet, "24px Arial", "#000000"), playerCashText = new createjs.Text("" + playerCash, "24px Arial", "#000000"), jackpotText = new createjs.Text("" + jackpot, "24px Arial", "#000000"), resultText = new createjs.Text("Welcome! / Bienvenu!", "18px Arial", "#000000");

var reelOne, reelTwo, reelThree;
var reels = [
    reelOne = new createjs.Bitmap(barImage),
    reelTwo = new createjs.Bitmap(orangeImage),
    reelThree = new createjs.Bitmap(grapeImage)];

var selectSound = new Audio("./sounds/sound_select.mp3"), jackpotSound = new Audio("./sounds/sound_jackpot.mp3"), winSound = new Audio("./sounds/sound_win.mp3"), loseSound = new Audio("./sounds/sound_lose.mp3");

/* init function handles everything that needs to be initialized on application run */
function init() {
    stage = new createjs.Stage(document.getElementById("canvas"));

    createjs.Ticker.setFPS(60);
    stage.enableMouseOver(20);

    /* Assign initial values */
    playerCash = 50;
    jackpot = 100;

    /* Setup the stage */
    stage.addChild(canvasBackgroundImage);

    logoutAreaImage.x = 83;
    logoutAreaImage.y = 736;
    stage.addChild(logoutAreaImage);

    fullResetAreaImage.x = 535;
    fullResetAreaImage.y = 738;
    stage.addChild(fullResetAreaImage);

    slotMachineImage.x = canvasBackgroundImage.x + 150;
    slotMachineImage.y = canvasBackgroundImage.y + 80;
    stage.addChild(slotMachineImage);

    reels[0].x = slotMachineImage.x + 98;
    reels[0].y = slotMachineImage.y + 238;
    stage.addChild(reels[0]);
    reels[1].x = slotMachineImage.x + 198;
    reels[1].y = slotMachineImage.y + 238;
    stage.addChild(reels[1]);
    reels[2].x = slotMachineImage.x + 298;
    reels[2].y = slotMachineImage.y + 238;
    stage.addChild(reels[2]);

    resetImage.x = slotMachineImage.x + 48;
    resetImage.y = slotMachineImage.y + 412;
    stage.addChild(resetImage);
    betOneImage.x = slotMachineImage.x + 134;
    betOneImage.y = slotMachineImage.y + 412;
    stage.addChild(betOneImage);
    betMaxImage.x = slotMachineImage.x + 220;
    betMaxImage.y = slotMachineImage.y + 412;
    stage.addChild(betMaxImage);
    spinImage.x = slotMachineImage.x + 306;
    spinImage.y = slotMachineImage.y + 412;
    stage.addChild(spinImage);

    playerBetText.x = canvasBackgroundImage.x + 250;
    playerBetText.y = canvasBackgroundImage.y + 24;
    stage.addChild(playerBetText);
    playerCashText.x = canvasBackgroundImage.x + 520;
    playerCashText.y = canvasBackgroundImage.y + 24;
    stage.addChild(playerCashText);
    jackpotText.x = canvasBackgroundImage.x + 370;
    jackpotText.y = canvasBackgroundImage.y + 748;
    stage.addChild(jackpotText);
    resultText.x = (slotMachineImage.x + 155) - resultText.text.length;
    resultText.y = slotMachineImage.y + 595;
    stage.addChild(resultText);

    stage.update();
    createjs.Ticker.addEventListener("tick", handleTick);

    /* Add event listeners for images */
    resetImage.addEventListener("mouseover", function () {
        stage.addChild(resetHoverImage);
        resetHoverImage.x = resetImage.x;
        resetHoverImage.y = resetImage.y;
        stage.update();
    });
    resetImage.addEventListener("rollout", function () {
        stage.removeChild(resetHoverImage);
        stage.update();
    });
    resetImage.addEventListener("click", function () {
        selectSound.play();

        playerCash += playerBet;
        playerBet = 0;

        updateText();
        stage.update();
    });

    betOneImage.addEventListener("mouseover", function () {
        stage.addChild(betOneHoverImage);
        betOneHoverImage.x = betOneImage.x;
        betOneHoverImage.y = betOneImage.y;
        stage.update();
    });

    betOneImage.addEventListener("rollout", function () {
        stage.removeChild(betOneHoverImage);
        stage.update();
    });

    betOneImage.addEventListener("click", function () {
        selectSound.play();

        if (playerCash < 1) {
            alert("Insufficient funds.");
            return;
        }

        if (playerBet < MAX_BET) {
            playerCash -= 1;
            playerBet += 1;
        } else {
            alert("Max bet reached.");
            return;
        }

        updateText();
        stage.update();
    });

    betMaxImage.addEventListener("mouseover", function () {
        stage.addChild(betMaxHoverImage);
        betMaxHoverImage.x = betMaxImage.x;
        betMaxHoverImage.y = betMaxImage.y;
        stage.update();
    });

    betMaxImage.addEventListener("rollout", function () {
        stage.removeChild(betMaxHoverImage);
        stage.update();
    });

    betMaxImage.addEventListener("click", function () {
        selectSound.play();

        if (playerCash < (MAX_BET - playerBet)) {
            alert("Insufficient funds.");
            return;
        }

        if (playerBet == MAX_BET) {
            alert("Max bet reached.");
            return;
        }

        playerCash -= (MAX_BET - playerBet);
        playerBet += (MAX_BET - playerBet);

        updateText();
        stage.update();
    });

    logoutAreaImage.addEventListener("mouseover", function () {
        stage.addChild(logoutHoverImage);
        logoutHoverImage.x = logoutAreaImage.x;
        logoutHoverImage.y = logoutAreaImage.y;
        stage.update();
    });

    logoutAreaImage.addEventListener("rollout", function () {
        stage.removeChild(logoutHoverImage);
        stage.update();
    });

    logoutAreaImage.addEventListener("click", function () {
        selectSound.play();

        stage.update();

        if (confirm("Progress will be lost, continue?"))
            window.close();
    });

    fullResetAreaImage.addEventListener("mouseover", function () {
        stage.addChild(fullResetHoverImage);
        fullResetHoverImage.x = fullResetAreaImage.x;
        fullResetHoverImage.y = fullResetAreaImage.y;
        stage.update();
    });

    fullResetAreaImage.addEventListener("rollout", function () {
        stage.removeChild(fullResetHoverImage);
        stage.update();
    });

    fullResetAreaImage.addEventListener("click", function () {
        selectSound.play();

        reset();

        stage.update();
    });

    spinImage.addEventListener("mouseover", function () {
        stage.addChild(spinHoverImage);
        spinHoverImage.x = spinImage.x;
        spinHoverImage.y = spinImage.y;
        stage.update();
    });

    spinImage.addEventListener("rollout", function () {
        stage.removeChild(spinHoverImage);
        stage.update();
    });

    spinImage.addEventListener("click", function () {
        selectSound.play();

        stage.update();

        if (playerBet > 0) {
            spinResult = spin();
            calculateWinnings();
        } else {
            alert("You must bet before spinning.");
        }
    });
}

/* handleTick function is called on every frame */
function handleTick() {
    stage.update();
    updateText();
}

/* updateText function refreshes the text on screen */
function updateText() {
    playerBetText.text = playerBet.toString();
    playerCashText.text = playerCash.toString();
    jackpotText.text = jackpot.toString();
}

/* checkRange function checks if a value falls within a range of bounds */
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds)
        return value;
    else
        return !value;
}

/* spin function determines the betLine results */
function spin() {
    var betLine = [" ", " ", " "];
    var outCome = [0, 0, 0];

    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 65) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 27):
                betLine[spin] = "Blank";
                blank++;
                reels[spin].image = blankImage;
                break;
            case checkRange(outCome[spin], 28, 37):
                betLine[spin] = "Grape";
                grape++;
                reels[spin].image = grapeImage;
                break;
            case checkRange(outCome[spin], 38, 46):
                betLine[spin] = "Banana";
                banana++;
                reels[spin].image = bananaImage;
                break;
            case checkRange(outCome[spin], 47, 54):
                betLine[spin] = "Orange";
                orange++;
                reels[spin].image = orangeImage;
                break;
            case checkRange(outCome[spin], 55, 59):
                betLine[spin] = "Cherry";
                cherry++;
                reels[spin].image = cherryImage;
                break;
            case checkRange(outCome[spin], 60, 62):
                betLine[spin] = "Bar";
                bar++;
                reels[spin].image = barImage;
                break;
            case checkRange(outCome[spin], 63, 64):
                betLine[spin] = "Bell";
                bell++;
                reels[spin].image = bellImage;
                break;
            case checkRange(outCome[spin], 65, 65):
                betLine[spin] = "Seven";
                seven++;
                reels[spin].image = sevenImage;
                break;
        }
    }
    return betLine;
}

/* calculateWinnings function calculates the player's winnings */
function calculateWinnings() {
    if (blank == 0) {
        if (grape == 3)
            winnings = playerBet * 10;
        else if (banana == 3)
            winnings = playerBet * 20;
        else if (orange == 3)
            winnings = playerBet * 30;
        else if (cherry == 3)
            winnings = playerBet * 40;
        else if (bar == 3)
            winnings = playerBet * 50;
        else if (bell == 3)
            winnings = playerBet * 75;
        else if (seven == 3)
            winnings = playerBet * 100;
        else if (grape == 2)
            winnings = playerBet * 2;
        else if (banana == 2)
            winnings = playerBet * 2;
        else if (orange == 2)
            winnings = playerBet * 3;
        else if (cherry == 2)
            winnings = playerBet * 4;
        else if (bar == 2)
            winnings = playerBet * 5;
        else if (bell == 2)
            winnings = playerBet * 10;
        else if (seven == 2)
            winnings = playerBet * 20;
        else if (seven == 1)
            winnings = playerBet * 5;
        else
            winnings = playerBet;

        winNumber++;
        won();
    } else {
        lossNumber++;
        lost();
    }
}

/* checkJackpot function checks if the user won the jackpot */
function checkJackpot() {
    var jackPotTry = Math.floor(Math.random() * 51 + 1);
    var jackPotWin = Math.floor(Math.random() * 51 + 1);
    if (jackPotTry == jackPotWin) {
        jackpotSound.play();
        alert("You won: $" + jackpot + ", from the jackpot!");
        resultText.text = "Jackpot! - $" + jackpot;
        playerCash += jackpot;
        jackpot = 100;
    }
}

/* won function is called when player won */
function won() {
    resultText.text = "Won: Enjoy the $" + winnings + " winnings.";
    checkJackpot();
    winSound.play();
    playerCash += winnings;
    stage.update();
    resetFruitCount();
    resetTurn();
}

/* lost function is called when player lost */
function lost() {
    loseSound.play();
    resultText.text = "Lost: Sorry, better luck next time.";
    jackpot += playerBet;
    updateText();
    resetFruitCount();
    resetTurn();
}

/* resetFruitCount function resets the total fruit counts */
function resetFruitCount() {
    blank = 0;
    grape = 0;
    banana = 0;
    orange = 0;
    cherry = 0;
    bar = 0;
    bell = 0;
    seven = 0;
}

/* reset function resets the game to initial state */
function reset() {
    playerBet = 0;
    playerCash = 50;
    jackpot = 100;

    winNumber = 0;
    lossNumber = 0;

    winnings = 0;

    resultText.text = "Welcome! / Bienvenu!";

    updateText();
}

/* resetTurn function sets the players bet back to 0 */
function resetTurn() {
    playerBet = 0;
}
//# sourceMappingURL=app.js.map
