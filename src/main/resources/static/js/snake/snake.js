let stompClient = null;
let timeStamp = 0;
let oldTimeStamp = 0;
let oldTimeStampMouse = 0;
let username = null;

let posMouse = {x: 0, y: 0};

const WIDTH = 500;
const HEIGHT = 500;

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const map = new Map(WIDTH, HEIGHT);


window.onload = init;

function init() {
    username = prompt("Entrer votre nom", "");
    connect()
    $("#myCanvas").on("mousemove", event => {
        posMouse.x = event.pageX;
        posMouse.y = event.pageY;
    })
    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
    // Calculate the number of milliseconds passed since the last frame
    let msPassed = (timeStamp - oldTimeStamp);
    let msPassedMouse = (timeStamp - oldTimeStampMouse);
    let player;
    map.players.forEach(p => {
        if (p.name === username) {
            player = p;
        }
    });
    if (player) {
        if (msPassed > 50) {
            oldTimeStamp = timeStamp;
            player.directionTowards(msPassed);
            map.update(msPassed);
            map.draw(ctx);
        }
        if (msPassedMouse > 250) {
            oldTimeStampMouse = timeStamp;
            sendPosition(player);
        }
    }
    window.requestAnimationFrame(gameLoop);
}

function connect() {
    if(username) {
        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }
}


function onConnected() {
    // Subscribe send messages
    stompClient.subscribe('/snake/public', onReceived);

    // Tell your username to the server
    stompClient.send("/app/snake.addPlayer", {}, JSON.stringify({sender: username, content: JSON.stringify({}), type: 'JOIN'}));
}

function sendPosition(player) {
    if(stompClient) {
        const message = {
            sender: username,
            content: JSON.stringify(
                {
                    towards: {x: posMouse.x, y: posMouse.y},
                    direction: player.direction,
                    head: player.head,
                    body: player.body,
                    score: player.score
                }),
            type: 'POSITION'
        };
        stompClient.send("/app/snake.changePosition", {}, JSON.stringify(message));
    }
}


function onError(error) {
    console.log(error);
}


function onReceived(payload) {
    const message = JSON.parse(payload.body);

    if (message.type === 'JOIN') {
    } else if (message.type === 'LEAVE') {
    } else if (message.type === 'POSITION') {
        let name = message.sender;
        let data = JSON.parse(message.content);
        for (let i = 0; i < map.players.length; i++) {
            if (map.players[i].name === name) {
                map.players[i].changeTowards(new Coord(data.towards.x, data.towards.y));
                map.players[i].changeDirection(new Coord(data.direction.x, data.direction.y));
                map.players[i].head = new Coord(data.head.x, data.head.y);
                map.players[i].body = [];
                data.body.forEach(c => {
                    map.players[i].body.push(new Coord(c.x, c.y));
                });
                map.players[i].score = data.score;
            }
        }
    } else if (message.type === 'UPDATE') {
        let updatedMap = JSON.parse(message.content);

        map.width = updatedMap.width;
        map.height = updatedMap.height;

        map.players = [];
        updatedMap.players.forEach(player => {
            map.players.push(new Player(player.name, new Coord(player.head.x, player.head.y), player.score));
        });
        map.balls = [];
        updatedMap.balls.forEach(ball => {
            map.balls.push(new Ball(new Coord(ball.coord.x, ball.coord.y), ball.points));
        });
    }
}