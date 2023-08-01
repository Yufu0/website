const colors = [
    ['#596cf5', '#bdc4fb'],
    ['#ff0000', '#ff7b7b'],
    ['#ff8c00', '#ffd8b1'],
    ['#00ff00', '#9aff9a'],
    ['#00ffff', '#b0e2ff'],
    ['#ffd700', '#fff1a8'],
    ['#ff00ff', '#ffbbff'],
    ['#0000ff', '#a8c6ff']
];

class Player {
    constructor(name, head, score) {
        this.name = name;
        this.head = head;
        this.direction = new Coord(0, 0);
        this.towards = new Coord(0,0);
        this.body = [head];
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
        this.updateLength();
    }

    changeDirection(direction) {
        this.direction = direction;
    }

    changeTowards(towards) {
        this.towards = towards;
    }
    directionTowards(msPassed) {
        if (!msPassed)
            return;
        if (this.head.touch(this.towards))
            return;
        let dx = this.towards.x - this.head.x;
        let dy = this.towards.y - this.head.y;

        let angle1 = Math.atan2(this.direction.y, this.direction.x);
        let angle2 = Math.atan2(dy, dx);
        if (angle1 - angle2 > Math.PI)
            angle2 += 2 * Math.PI;
        if (angle2 - angle1 > Math.PI)
            angle1 += 2 * Math.PI;
        let angle = (1 - msPassed / 500) * angle1 + (msPassed / 500) * angle2;

        this.direction = new Coord(
            Math.cos(angle),
            Math.sin(angle)
        );
        console.log(this.direction);
    }

    getColor() {
        var hash = 0;
        for (var i = 0; i < this.name.length; i++) {
            hash = 31 * hash + this.name.charCodeAt(i);
        }
        var index = Math.abs(hash % colors.length);
        return colors[index];
    }
}