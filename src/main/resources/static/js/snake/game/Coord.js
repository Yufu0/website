const TOUCHSIZE = 150;

class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    touch(coord, touchSize = TOUCHSIZE) {
        return ((this.x - coord.x) ** 2 + (this.y - coord.y) ** 2) < touchSize;
    }

    equals(coord) {
        return this.x === coord.x && this.y === coord.y;
    }
}