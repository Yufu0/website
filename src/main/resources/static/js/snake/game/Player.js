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
        this.oldTimeMove = null;
        this.oldTimeTurn = null;
    }

    move(timeStamp, map) {
        if (!this.oldTimeMove) {
            this.oldTimeMove = timeStamp;
            return;
        }
        if (!timeStamp)
            return;

        let msPassed = timeStamp - this.oldTimeMove;
        let dx = msPassed * this.speed / 1000 * this.direction.x;
        let dy = msPassed * this.speed / 1000 * this.direction.y;

        let newHead = new Coord((this.head.x + dx), (this.head.y + dy));

        if (newHead.x < 0)
            newHead.x = 0;
        if (newHead.x > map.width)
            newHead.x = map.width;
        if (newHead.y < 0)
            newHead.y = 0;
        if (newHead.y > map.height)
            newHead.y = map.height;

        if (newHead.touch(this.head, 10)) {
            return;
        }
        this.oldTimeMove = timeStamp;

        this.body.unshift(this.head);
        this.body.pop();
        this.head = newHead;
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

    turn(timeStamp) {
        if (!this.oldTimeTurn) {
            this.oldTimeTurn = timeStamp;
            return;
        }
        if (!timeStamp)
            return;
        if (this.head.touch(this.towards))
            return;
        let msPassed = timeStamp - this.oldTimeTurn;
        this.oldTimeTurn = timeStamp;

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
    }

    getColor() {
        let hash = 0;
        for (let i = 0; i < this.name.length; i++) {
            hash = 31 * hash + this.name.charCodeAt(i);
        }
        let index = Math.abs(hash % colors.length);
        return colors[index];
    }
}