let stompClient = null;
let oldTimeFrame = 0;
let oldTimeMouse = 0;
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
        map.players.forEach(p => {
            if (p.name === username) {
                    p.changeTowards(new Coord(posMouse.x, posMouse.y));
                }
            });
    })
    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
    // Calculate the number of milliseconds passed since the last frame
    let msFrame = (timeStamp - oldTimeFrame);
    if (msFrame > 50) {
        map.update(timeStamp);
        map.draw(ctx);
        oldTimeFrame = timeStamp;
    }

    let msPassedMouse = (timeStamp - oldTimeMouse);
    map.players.forEach(p => {
        if (p.name === username) {
            if (msPassedMouse > 150) {
                oldTimeMouse = timeStamp;
                sendPosition(p);
            }
        }
    });
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
        if (message.sender !== username) {
            let name = message.sender;
            let data = JSON.parse(message.content);
            for (let i = 0; i < map.players.length; i++) {
                if (map.players[i].name === name) {
                    let newTowards = new Coord(data.towards.x, data.towards.y);
                    let newDirection = new Coord(data.direction.x, data.direction.y);
                    if (!map.players[i].towards.equals(newTowards)) {
                        map.players[i].changeTowards(newTowards);
                        map.players[i].changeDirection(newDirection);
                    }
                    map.players[i].head = new Coord(data.head.x, data.head.y);
                    map.players[i].body = [];
                    data.body.forEach(c => {
                        map.players[i].body.push(new Coord(c.x, c.y));
                    });
                    map.players[i].score = data.score;
                }
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