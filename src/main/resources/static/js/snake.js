const width = 1000;
const height = 1000;
const touchSize = 125;

var stompClient = null;
var username = "celio";




class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    touch(coord) {
        return (this.x - coord.x)**2 + (this.y - coord.y)**2 < touchSize;
    }

    add(coord) {
        return new Coord(this.x + coord.x, this.y + coord.y);
    }
}

class Player {
    constructor(name, head, score) {
        this.name = name;
        this.head = head;
        this.direction = new Coord(0, 0)
        this.body = [head]
        this.score = score;
    }

    move() {
        this.body.unshift(this.head);
        this.body.pop();
        if (this.head.x + this.direction.x > 0 || this.head.x + this.direction.x < width || this.head.y + this.direction.y > 0 || this.head.y + this.direction.y < height)
            this.head = new Coord(this.head.x + this.direction.x, this.head.y + this.direction.y);
    }

    eat(ball) {
        this.score += ball.points;
    }

    updateLength() {
        if (this.body.length === Math.floor(Math.sqrt(this.score)))
            return;
        if (this.body.length < Math.floor(Math.sqrt(this.score))) {
            this.body.push(this.body[this.body.length - 1]);
        } else {
            this.body.pop();
        }
        this.updateLength()
    }
}


class Ball {
    constructor(coord, points) {
        this.coord = coord;
        this.points = points;
    }
}

class Map {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.players = [];
        this.balls = [];
    }

    update() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].move();
            for (let j = 0; j < this.balls.length; j++) {
                if (this.players[i].head.touch(this.balls[j].coord)) {
                    this.players[i].eat(this.balls[j]);
                    this.balls.splice(j, 1);
                    map.balls.push(new Ball(new Coord(Math.random()*map.width, Math.random()*this.height), 100));
                }
            }
            this.players[i].updateLength();
        }


    }

    draw(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);
        let i;
        for (i = 0; i < this.players.length; i++) {
            for (let j = 0; j < this.players[i].body.length; j++) {
                drawCircle(ctx, this.players[i].body[j].x, this.players[i].body[j].y, 8, "pink");
            }
            drawCircle(ctx, this.players[i].head.x, this.players[i].head.y, 10, "red");
        }
        for (i = 0; i < this.balls.length; i++) {
            drawCircle(ctx, this.balls[i].coord.x, this.balls[i].coord.y, 5, "green");
        }
    }
}

function drawCircle(ctx, x, y, r, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

window.onload = init;
canvas = null;
ctx = null;
map = null;

function init() {
    username = prompt("Comment t'appelles-tu ?", "<Entrez ici votre nom>");
    connect()
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    timeStamp = 0;
    oldTimeStamp = 0;
    timeStampMouse = 0;
    oldTimeStampMouse = 0;
    $("#myCanvas").on("mousemove", onMouseMove);


    map = new Map(1000, 1000);
        for (let i = 0; i < 100; i++) {
        map.balls.push(new Ball(new Coord(Math.random()*map.width, Math.random()*map.height), 1000));

    }
    window.requestAnimationFrame(gameLoop);
}

function gameLoop() {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp);
    oldTimeStamp = timeStamp;
    map.update();
    map.draw(ctx);
    window.requestAnimationFrame(gameLoop);
}

timeStampMouse = 0;
oldTimeStampMouse = 0;
function onMouseMove(event) {
    timeStampMouse = event.timeStamp;
    if (timeStampMouse - oldTimeStampMouse > 100) {
        oldTimeStampMouse = timeStampMouse;
        sendDirection(event);
    }
}





function connect() {
    if(username) {
        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        console.log(stompClient)
        stompClient.connect({}, onConnected, onError);
        console.log(stompClient)
    }
}


function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/snake/public', onReceived);

    // Tell your username to the server
    stompClient.send("/app/snake.addPlayer",
        {},
        JSON.stringify({sender: username, content: JSON.stringify({}), type: 'JOIN'})
    )
}

function sendDirection(event) {
    if(stompClient) {
        const message = {
            sender: username,
            content: JSON.stringify({x: event.pageX , y: event.pageY}),
            type: 'DIRECTION'
        };
        stompClient.send("/app/snake.changeDirection", {}, JSON.stringify(message));
    }
}


function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}


function onReceived(payload) {
    var message = JSON.parse(payload.body);

    if (message.type === 'JOIN') {
        map.players.push(new Player(message.sender, new Coord(100, 100), 1000));
    } else if (message.type === 'LEAVE') {
    } else if (message.type === 'DIRECTION') {
        name = message.sender;
        coord = JSON.parse(message.content);
        for (let i = 0; i < map.players.length; i++) {
            if (map.players[i].name === name) {
                map.players[i].direction = new Coord(
                    (coord.x - map.players[i].head.x) / Math.sqrt((coord.x - map.players[i].head.x)**2 + (coord.y - map.players[i].head.y)**2),
                    (coord.y - map.players[i].head.y) / Math.sqrt((coord.x - map.players[i].head.x)**2 + (coord.y - map.players[i].head.y)**2)
                );
            }
        }
    } else if (message.type === 'UPDATE') {
    }
}