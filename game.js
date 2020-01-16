//@ts-check
var game = function(p1, p2, id) {
    this.board = [];
    this.p1 = p1;
    this.p2 = p2;
    this.id = id;
    this.ended = false;

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
   
        for (var i = 0; i<7; i++) {
            let current = this.board[i][0];
            let counter = 1;
            for (var j = 1; j<6; j++) {
                if (current === this.board[i][j] && current != "") {
                    counter++;
                } else {
                    current = this.board[i][j];
                    counter = 1;
                }


                if (counter === 4) {
                    win = true;
                }
            }
        }
        for (var i = 0; i<6; i++) {
            let current = this.board[0][i];
            let counter = 1;
            for (var j = 1; j<7; j++) {
                if (current === this.board[j][i] && current != "") {
                    counter++;
                } else {
                    current = this.board[j][i];
                    counter = 1;
                }
                if (counter === 4) {
                    win = true;
                }
            }
        }

        var j = 2;
        var current = this.board[0][3];
        var count = 1;
        for (var i = 1; i<3; i++) {
            if (current === this.board[i][j] && current != "") {
                count++;
            } else {
                count = 1;
                current = this.board[i][j];
            }
            if (count == 4) {
                win = true;
            }
            j--;
        }
        //
        var j = 3;
        var current = this.board[0][4];
        var count = 1;
        for (var i = 1; i<4; i++) {
            if (current === this.board[i][j] && current != "") {
                count++;
            } else {
                count = 1;
                current = this.board[i][j];
            }
            if (count == 4) {
                win = true;
            }
            j--;
        }
        //
        var j = 4;
        var current = this.board[0][5];
        var count = 1;
        for (var i = 1; i<7; i++) {
            if (current === this.board[i][j] && current != "") {
                count++;
            } else {
                count = 1;
                current = this.board[i][j];
            }
            if (count == 4) {
                win = true;
            }
            j--;
        }
        // 
        var j = 4;
        var current = this.board[1][5];
        var count = 1;
        for (var i = 2; i<7; i++) {
            if (current === this.board[i][j] && current != "") {
                count++;
            } else {
                count = 1;
                current = this.board[i][j];
            }
            if (count == 4) {
                win = true;
            }
            j--;
        }
        //
        var j = 1;
        var current = this.board[2][0];
        var count = 1;
        for (var i = 3; i<7; i++) {
            if (current === this.board[i][j] && current != "") {
                count++;
            } else {
                count = 1;
                current = this.board[i][j];
            }
            if (count == 4) {
                win = true;
            }
            j++;
        }
        //
        var j = 1;
        var current = this.board[3][0];
        var count = 1;
        for (var i = 4; i<7; i++) {
            if (current === this.board[i][j] && current != "") {
                count++;
            } else {
                count = 1;
                current = this.board[i][j];
            }
            if (count == 4) {
                win = true;
            }
            j++;
        }
        var j = 2;
        var current = this.board[6][3];
        var count = 1;
        for (var i = 5; i>2; i--) {
            if (current === this.board[i][j] && current != "") {
                count++;
            } else {
                count = 1;
                current = this.board[i][j];
            }
            if (count == 4) {
                win = true;
            }
            j--;
        }
        var j = 3;
        var current = this.board[6][4];
        var count = 1;
        for (var i = 5; i>2; i--) {
            if (current === this.board[i][j] && current != "") {
                count++;
            } else {
                count = 1;
                current = this.board[i][j];
            }
            if (count == 4) {
                win = true;
            }
            j--;
        }
        var j = 4;
        var current = this.board[6][5];
        var count = 1;
        for (var i = 5; i>0; i--) {
            if (current === this.board[i][j] && current != "") {
                count++;
            } else {
                count = 1;
                current = this.board[i][j];
            }
            if (count == 4) {
                win = true;
            }
            j--;
        }
        var j = 4;
        var current = this.board[5][5];
        var count = 1;
        for (var i = 4; i>-1; i--) {
            if (current === this.board[i][j] && current != "") {
                count++;
            } else {
                count = 1;
                current = this.board[i][j];
            }
            if (count == 4) {
                win = true;
            }
            j--;
        }
        var j = 4;
        var current = this.board[4][5];
        var count = 1;
        for (var i = 3; i<-1; i--) {
            if (current === this.board[i][j] && current != "") {
                count++;
            } else {
                count = 1;
                current = this.board[i][j];
            }
            if (count == 4) {
                win = true;
            }
            j--;
        }
        var j = 4;
        var current = this.board[3][5];
        var count = 1;
        for (var i = 2; i<-1; i--) {
            if (current === this.board[i][j] && current != "") {
                count++;
            } else {
                count = 1;
                current = this.board[i][j];
            }
            if (count == 4) {
                win = true;
            }
            j--;
        }
        if (win) {
            let loser = this.p1;
            if (socket == p1) {
                loser = this.p2;
            }
            socket.send(JSON.stringify({message: 'gameEnd', winner: true, disconnected: false}));
            loser.send(JSON.stringify({message: 'gameEnd', winner: false, disconnected: false}));
            this.p1.close();
            this.p2.close();
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