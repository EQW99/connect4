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
        let winDiscs = {
            d1: [],
            d2: [],
            d3: [],
            d4: []
        }
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
                    winDiscs.d1.push(i); // col
                    winDiscs.d1.push(j); // row
                    winDiscs.d2.push(i); // col
                    winDiscs.d2.push(j-1); // row
                    winDiscs.d3.push(i); // col
                    winDiscs.d3.push(j-2); // row
                    winDiscs.d4.push(i); // col
                    winDiscs.d4.push(j-3); // row

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
                    winDiscs.d1.push(i); 
                    winDiscs.d1.push(j); 
                    winDiscs.d2.push(i); 
                    winDiscs.d2.push(j-1);
                    winDiscs.d3.push(i); 
                    winDiscs.d3.push(j-2);
                    winDiscs.d4.push(i); 
                    winDiscs.d4.push(j-3);
                    

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
                        winDiscs.d1.push(sum); 
                        winDiscs.d1.push(sum2); 
                        winDiscs.d2.push(sum-1); 
                        winDiscs.d2.push(sum2-1);
                        winDiscs.d3.push(sum-2); 
                        winDiscs.d3.push(sum2-2);
                        winDiscs.d4.push(sum-3); 
                        winDiscs.d4.push(sum2-3);
                        
                        
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
                        winDiscs.d1.push(i-delta); 
                        winDiscs.d1.push(j+delta); 
                        winDiscs.d2.push(i-delta+1); 
                        winDiscs.d2.push(j+delta-1);
                        winDiscs.d3.push(i-delta+2); 
                        winDiscs.d3.push(j+delta-2);
                        winDiscs.d4.push(i-delta+3); 
                        winDiscs.d4.push(j+delta-3);
                        
                    }
                }
            }
        }
        
        if (win) {
            // for winDiscss.d1-d4, [0] contains the colummn, [1] contains the row
            this.board[winDiscs["d1"][0]][winDiscs["d1"][1]] += "Win";
            this.board[winDiscs["d2"][0]][winDiscs["d2"][1]] += "Win";
            this.board[winDiscs["d3"][0]][winDiscs["d3"][1]] += "Win";
            this.board[winDiscs["d4"][0]][winDiscs["d4"][1]] += "Win";

            let loser = this.p1;
            if (socket == p1) {
                loser = this.p2;
            }
            socket.send(JSON.stringify({message: 'gameEnd', winner: true, disconnected: false, board: this.board}));
            loser.send(JSON.stringify({message: 'gameEnd', winner: false, disconnected: false, board: this.board}));
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