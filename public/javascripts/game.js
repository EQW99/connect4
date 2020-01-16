function Game() {
    this.myTurn = true;
    this.board = [];
    this.startedAt = null;

    for (let i = 0; i < 7; i++) {
        this.board[i] = [];
        for (let j = 0; j < 6; j++) {
            this.board[i].push("");
        }
    }

    this.start = function(myTurn) {
        this.startedAt = Date.now();
        this.myTurn = myTurn;
        if (this.myTurn) {
            enableBoard();
        }
    }

    this.updateBoard = function(board) {
        this.board = board;
        renderBoard(this.board);
    }

    this.switchTurn = function() {
        this.myTurn = !this.myTurn;
        if (this.myTurn) {
            enableBoard();
        }
        else {
            disableBoard();
        }
    }


}