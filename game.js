//@ts-check
var game = function(p1, p2, id, appStats) {
    this.board = [];
    this.p1 = p1;
    this.p2 = p2;
    this.id = id;
    this.ended = false;
    this.appStats = appStats;

    for (let i = 0; i < 7; i++) {
        this.board[i] = [];
        for (let j = 0; j < 6; j++) {
            this.board[i].push("");
        }
    }

    this.checkValidMove = function(column) {
        if (this.board[column].includes("")) {
            return true;
        }
        return false;
    }


    this.addDisc = function(column, socket) {
        for (let i = 6; i > -1; i--) {
            if (this.board[column][i] == "") {
                if (socket == this.p1) {
                    this.board[column][i] = "yellow";
                    break;
                }
                else {
                    this.board[column][i] = "red";
                    break;
                }
                
            }
        }
        let other = this.p1;
        if (socket == p1) {
            other = this.p2;
        }
        socket.send(JSON.stringify({message: 'moveMade', board: this.board}));
        other.send(JSON.stringify({message: 'moveMade', board: this.board}));

        this.checkWin(socket);
    }

    this.checkWin = function(socket) {
        let win = false;
        let winDisc1 = [];
        let winDisc2 = [];
        let winDisc3 = [];
        let winDisc4 = [];
        for (var i = 0; i<7 && win === false; i++) {
            let current = this.board[i][0];
            let counter = 1;
            for (var j = 1; j<6 && win === false; j++) {
                if (current === this.board[i][j] && current != "") {
                    counter++;
                } else {
                    current = this.board[i][j];
                    counter = 1;
                }


                if (counter === 4) {
                    win = true;
                    winDisc1.push(i); // col
                    winDisc1.push(j); // row
                    winDisc2.push(i); // col
                    winDisc2.push(j-1); // row
                    winDisc3.push(i); // col
                    winDisc3.push(j-2); // row
                    winDisc4.push(i); // col
                    winDisc4.push(j-3); // row

                }
            }
        }
        for (var i = 0; i<6 && win === false; i++) {
            let current = this.board[0][i];
            let counter = 1;
            for (var j = 1; j<7 && win === false; j++) {
                if (current === this.board[j][i] && current != "") {
                    counter++;
                } else {
                    current = this.board[j][i];
                    counter = 1;
                }
                if (counter === 4) {
                    win = true;
                    winDisc1.push(i); 
                    winDisc1.push(j); 
                    winDisc2.push(i); 
                    winDisc2.push(j-1);
                    winDisc3.push(i); 
                    winDisc3.push(j-2);
                    winDisc4.push(i); 
                    winDisc4.push(j-3);
                    

                }
            }
        }
        

        for (var i = 0; i<7 && win === false; i++) {
            for (var j = 0; j<6 && win === false; j++) {
                var counter = 1;
                let current = this.board[i][j];
                for (var delta = 1; delta<(6-j) && delta<(7-i) && win === false; delta++) {
                    let sum = i + delta;
                    let sum2 = j + delta;
                    if (current === this.board[sum][sum2] && current != "") {
                        counter++;
                    } else {
                        current = this.board[sum][sum2];
                        counter = 1;
                    }
                    if (counter === 4) {
                        win = true;
                        winDisc1.push(sum); 
                        winDisc1.push(sum2); 
                        winDisc2.push(sum-1); 
                        winDisc2.push(sum2-1);
                        winDisc3.push(sum-2); 
                        winDisc3.push(sum2-2);
                        winDisc4.push(sum-3); 
                        winDisc4.push(sum2-3);
                        
                        
                        // record winning discs
                    }
                }

            }
        }
        
        for (var i = 6; i>-1 && win === false; i--) {
            for (var j = 0; j<6 && win === false; j++) {
                var counter = 1;
                let current = this.board[i][j];
                for (var delta = 1; delta<(6-j) && delta<=i && win === false; delta++) {
                    if (current === this.board[i - delta][j + delta] && current != "") {
                        counter++;
                    } else {
                        current = this.board[i - delta][j + delta];
                        counter = 1;
                    }
                    if (counter === 4) {
                        win = true;
                        // record winning discs
                        winDisc1.push(i-delta); 
                        winDisc1.push(j+delta); 
                        winDisc2.push(i-delta+1); 
                        winDisc2.push(j+delta-1);
                        winDisc3.push(i-delta+2); 
                        winDisc3.push(j+delta-2);
                        winDisc4.push(i-delta+3); 
                        winDisc4.push(j+delta-3);
                        
                    }
                }
            }
        }
        
        if (win) {
            // for winDiscs1-4, [0] contains the colummn, [1] contains the row
  
            let loser = this.p1;
            if (socket == p1) {
                loser = this.p2;
            }
            socket.send(JSON.stringify({message: 'gameEnd', winner: true, disconnected: false}));
            loser.send(JSON.stringify({message: 'gameEnd', winner: false, disconnected: false}));
            this.p1.close();
            this.p2.close();
            this.ended = true;
            this.appStats.liveGames--;
        }
        else {
            let other = this.p1;
            if (socket == p1) {
                other = this.p2;
            }
            socket.send(JSON.stringify({message: 'switchTurn'}));
            other.send(JSON.stringify({message: 'switchTurn'}));
        }
    }

    this.updateBoard = function(board) {
        this.board = board;
    }
}

module.exports = game;