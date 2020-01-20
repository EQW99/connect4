const socket = new WebSocket(((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host);
const game = new Game();

socket.onopen = function() {
    console.log("connected to server!");
    openPopup();
}

socket.onmessage = function(m) {
    let event = JSON.parse(m.data);
    let e = event.message;

    if (e == "gameStarted") {
        setColour(event.colour);
        game.start(event.myTurn);
        closePopup();
        var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)games\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        cookieValue++;
        document.cookie = "games="+cookieValue+";path=/";
        startTimer();
    }

    else if (e == "moveMade") {
        console.log("moveMade");
        game.updateBoard(event.board);
        playPingSound();
    }

    else if (e == "invalidMove") {
        console.log("invalidMove");
        showInvalidMoveWarning();
        playErrorSound();
    }

    else if (e == "switchTurn") {
        console.log("switchTurn");
        game.switchTurn();
    }

    else if (e == "gameEnd") {
        stopTimer();
        game.updateBoard(event.board);
        
        if (game.myTurn) {
            disableBoard();
        }
    
        let gameData = document.querySelectorAll("#game-data>div");
        for (i=0; i<3; i++) {
            gameData[i].style.display = "none";
        }
    
        if (event.disconnected) {
            document.getElementById("opponentDisconnect").style.display = "block";
        }
        else if (event.winner) {
            document.getElementById("win").style.display = "block";
        }
        else if (!event.winner & !event.draw) {
            document.getElementById("lost").style.display = "block";
        }
        else { // event.draw
            document.getElementById("draw").style.display = "block";
        }
    }
    else {
        console.log("Unkown event from server")
    }


}



let columns = document.getElementsByClassName('col');
for (let i = 0; i < columns.length; i++) {
    columns[i].addEventListener('click', function() {
        if (game.myTurn) {
            document.getElementById("invalidWarning").style.display = "none";
            columnNum = i;
            socket.send(columnNum);
        }
    })
}