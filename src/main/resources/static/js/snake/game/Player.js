class Player {
    constructor(name, head, score) {
        this.name = name;
        this.head = head;
        this.direction = new Coord(0, 0)
        this.body = [head]
        this.score = score;
        this.speed = 50;
    }

    move(msPassed, map) {
        this.body.unshift(this.head);
        this.body.pop();
        let dx = msPassed * this.speed / 1000 * this.direction.x;
        let dy = msPassed * this.speed / 1000 * this.direction.y;
        if ((this.head.x + dx) > 0 && (this.head.x + dx) < map.width && (this.head.y + dy) > 0 && (this.head.y + dy) < map.height)
            this.head = new Coord((this.head.x + dx), (this.head.y + dy));
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

    directionTowards(direction) {
        if (this.head.touch(direction))
            return;
        let dx = direction.x - this.head.x;
        let dy = direction.y - this.head.y;
        let norm = Math.sqrt(dx ** 2 + dy ** 2)

        this.direction = new Coord(
            dx / norm,
            dy / norm
        );
    }
}