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

// regularly clean websockets object
setInterval(function() {
    for (let i in websockets) {
      if (Object.prototype.hasOwnProperty.call(websockets,i)) {
        let gameObj = websockets[i];
        //if the gameObj has a final status, the game is complete/aborted
        if (gameObj.ended) {
          delete websockets[i];
        }
      }
    }
  }, 50000);

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
        if (websockets[ws.id]!=null) {
            let game = websockets[ws.id];
            let other = game.p1;
            if (ws == game.p1) {
                other = game.p2;
            }

            if (!game.ended) {
                other.send(JSON.stringify({message: 'gameEnd', winner: false, disconnected: true}));
                game.ended = true;
            }
            other.close();
        }
        else { // left queue
            gameQueue.shift(); // remove socket from queue

        }
    });


});

server.listen(port);