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