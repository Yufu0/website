class Map {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.players = [];
        this.balls = [];
    }

    update(timeStamp) {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].turn(timeStamp);
            this.players[i].move(timeStamp, this);
            for (let j = 0; j < this.balls.length; j++) {
                if (this.players[i].head.touch(this.balls[j].coord)) {
                    this.players[i].eat(this.balls[j]);
                    this.balls.splice(j, 1);
                }
            }
            this.players[i].updateLength();
        }
    }

    draw(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);
        let i;
        for (i = 0; i < this.balls.length; i++) {
            this.drawCircle(ctx, this.balls[i].coord.x, this.balls[i].coord.y, 5, "green");
        }
        for (i = 0; i < this.players.length; i++) {
            for (let j = 0; j < this.players[i].body.length; j++) {
                this.drawCircle(ctx, this.players[i].body[j].x, this.players[i].body[j].y, 8, this.players[i].getColor()[1]);
            }
            this.drawCircle(ctx, this.players[i].head.x, this.players[i].head.y, 10, this.players[i].getColor()[0]);
        }

    }

    drawCircle(ctx, x, y, r, color) {
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    listPlayers() {
        let list = [];
        for (let i = 0; i < this.players.length; i++) {
            list.push(this.players[i].name);
        }
        return list;
    }
}