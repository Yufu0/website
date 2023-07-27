const colors = [
    ['#596cf5', '#bdc4fb'],
    ['#dc143c', '#f69cae'],
    ['#ff8c00', '#ffc58f'],
    ['#ffd700', '#fff1a8'],
    ['#00ced1', '#aeeeee'],
    ['#00ff00', '#9aff9a'],
    ['#ff00ff', '#ffbbff'],
    ['#ff4500', '#ffbb99'],
    ['#00ff7f', '#99ffbb'],
    ['#ff69b4', '#ffb6c1'],
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