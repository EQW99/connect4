var express = require("express");
var http = require("http");
var indexRouter = require("./routes/index");
var websocket = require("ws");

var Game = require("./game");

var port = process.argv[2];
var app = express();

var server = http.createServer(app);
const wss = new websocket.Server({ server });


app.use(express.static(__dirname + "/public"));
app.get("/", indexRouter);
app.get("/play", indexRouter);



var websockets = {}; //property: websocket, value: game
var connectionID = 0;
var gameID = 0;
var gameQueue = [];

wss.on("connection", function connection(ws) {
    let con = ws;
    con.id = connectionID++;

    if (gameQueue.length == 1) {
        let p1 = con;
        let p2 = gameQueue.shift();
        let game = new Game(p1, p2, gameID++);
        websockets[p1.id] = game;
        websockets[p2.id] = game;
        let p1Starts = Math.random() >= 0.5; // random boolean
        p1.send(JSON.stringify({message: 'gameStarted', myTurn: p1Starts, colour: "yellow"}));
        p2.send(JSON.stringify({message: 'gameStarted', myTurn: !p1Starts, colour: "red"}));
    }
    else { // queue length = 0
        gameQueue.push(con);
    }

    ws.on('message', function incoming(data) {
        let column = data;
        let game = websockets[ws.id];
        if (game.checkValidMove(column)) {
            game.addDisc(column, ws);
        }
        else {
            ws.send(JSON.stringify({message: 'invalidMove'}));
        }
      });


    ws.on('close', function close() {
        let game = websockets[ws.id];
        let other = game.p1;
        if (ws == game.p1) {
            other = game.p2;
        }

        if (!game.ended) {
            other.send(JSON.stringify({message: 'gameEnd', winner: false, disconnected: true}));
        }
        other.close();
    });


});

server.listen(port);