function closePopup() {
    document.getElementById("queuePopup").style.display = "none";
}

function openPopup() {
    document.getElementById("queuePopup").style.opacity = 100;
}

function disableBoard() {
    let cols = document.getElementsByClassName("col");
    for (let i = 0; i < cols.length; i++) {
        cols[i].classList.remove("enabled");
    }
    document.getElementById("arrow").innerHTML = "&#129094;";
}

function enableBoard() {
    let cols = document.getElementsByClassName("col");
    for (let i = 0; i < cols.length; i++) {
        cols[i].classList.add("enabled");
    }
    document.getElementById("arrow").innerHTML = "&#129092;";
}

function setColour(colour) {
    if (colour == "red") {
        document.getElementById("youColour").classList.remove("yellow");
        document.getElementById("youColour").classList.add("red");
        document.getElementById("opponentColour").classList.remove("red");
        document.getElementById("opponentColour").classList.add("yellow");
    }
}

document.getElementsByClassName("fullscreen")[0].addEventListener("click", function() {
    if (!document.fullscreen) {
        document.documentElement.requestFullscreen();
    }
    else {
        document.exitFullscreen();
    }
})

function showInvalidMoveWarning() {
    document.getElementById("invalidWarning").style.display = "block";
}

function playPingSound() {
    document.getElementById("ping").play();
}

function playErrorSound() {
    document.getElementById("error").play();
}

var timeout;
let seconds = 0;
let minutes = 0;

function addTime() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
    let time = (minutes > 9 ? minutes : "0" + minutes) + ":" + (seconds > 9 ? seconds : "0" + seconds);
    document.getElementById("time").innerHTML = time;
    startTimer();
}

function startTimer() {
    timeout = setTimeout(addTime, 1000);
}

function stopTimer() {
    clearTimeout(timeout);
}

function renderBoard(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j=0; j < board[i].length; j++) {
            let columnID = `#col-${i+1}`;
            let discID = `#disc-${j+1}`;
            let discElement = document.querySelector(`${columnID} ${discID}`)
            if (board[i][j] === "red") {
                discElement.classList.add("red");
            }
            else if (board[i][j] === "yellow") {
                discElement.classList.add("yellow");
            }
            else if (board[i][j] === "yellowWin") {
                discElement.classList.add("yellowWin");
            }
            else if (board[i][j] === "redWin") {
                discElement.classList.add("redWin");
            }
        }
    }
} 