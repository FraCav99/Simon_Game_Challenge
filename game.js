/********************** Variables Settings ******************************/
var userClickedPattern = []; // User color pattern

var game_start = false; // Check if game status is initialized

var level = 1; // Starting level

var buttonColours = ["red", "blue", "green", "yellow"]; // Color sequence

var gamePattern = []; // Game pattern

var score = 0;

var highScore = 0;


/********************** Functions Settings ******************************/
function blink(currentColour) {
    currentColour.fadeOut(100).fadeIn(100);
}

function hideElement(){
    /* Hide element of the page */
    for (var i = 0; i < arguments.length; i++){
        $(arguments[i]).addClass("not-displayed");
    }
}


function showElement(){
    /* Show element on the page */
    for (var i = 0; i < arguments.length; i++){
        $(arguments[i]).removeClass("not-displayed");
    }
}


function playSound(name) {
    /* Play a given sound */
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}


function animatePress(currentColour) {
    /*
        Show a short animation
        when user press a button
    */
    currentColour.addClass("pressed")
    setTimeout(function () {
        currentColour.removeClass("pressed");
    }, 100);
}


function nextSequence() {
    /*
        Generate random number between 0 and 3
        And create a random game pattern
    */
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];

    var colorBox = $("." + randomChosenColour);

    // Animate the chosen colour
    blink(colorBox);
    playSound(randomChosenColour);


    gamePattern.push(randomChosenColour);

    userClickedPattern = [];

    $(".score .current-score").text("Score: " + score);
    $(".score .high-score").text("High Score: " + highScore);


    score++;

    if (score > highScore) {
        highScore = score;
    }

    hideElement(".last-window");

    $("footer").html("Made with <img class='heart-img' src='images/abstract-heart-png-6-transparent.png' alt='heart-img'> in <img class='italian-flag' src='images/italy-flag-small.png' alt='italy-flag'></p>");

    $("h1").text("Level " + level++);

}


function gameOver() {
    playSound("wrong");
    hideElement(".circle", ".button-container");
    showElement("footer", ".last-window");
    $("h1").text("Game Over! :(");
    $("footer").html("Check code on my <a href='https://github.com/FraCav99'><img src='images/github-logo.png'></a>");
    $("body").addClass("game-over");
    setTimeout(function () {
        $("body").removeClass("game-over");
    }, 200);
}


function checkAnswer(currentLevel) {
    // Check if the entire userPattern is correct
    var correct = true;

    // Check if the first element choosen by user is correct
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        if (userClickedPattern.length <= gamePattern.length) {
            // NOTE: apparenlty it loop on the same element for
            // the entire length of the gamePattern array
            for (var i = 0; i < gamePattern.length; i++) {
                if (userClickedPattern[currentLevel] !== gamePattern[currentLevel]) {
                    correct = false;
                    gameOver();
                    startOver();
                    break;
                }
            }
        }

        if ((userClickedPattern.length === gamePattern.length) && correct) {
            setTimeout(() => nextSequence(), 1000);
        }
    } else {
        gameOver();
        startOver();
    }
}


function startOver() {
    /* Restart the game if player lose*/
    level = 1;
    gamePattern = [];
    game_start = false;
    score = 0;
    highScore--;
}


/********************** Events Settings ******************************/


/* Start screen only is shown */
hideElement(".score", ".button-container", ".last-window");


/* When user click a button */
$("button").click(function () {
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);

    var userChosenColour_blink = $(this);
    animatePress(userChosenColour_blink);
    playSound(userChosenColour);

    checkAnswer(userClickedPattern.length - 1);
});


/* Detect when main button is clicked */
$(".start-game-button").on("click", () => {
    if (!game_start) {
        showElement(".score", ".button-container", ".circle");
        hideElement(".first-window", "footer");
        nextSequence();
        game_start = true;
    }
});