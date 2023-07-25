package com.celio.chat.snake.game;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Player {
    private String name;
    private int score;

    private Coord head;
    private Coord direction;
    private List<Coord> body;

    public void move() {
        body.add(0, head);
        body.remove(body.size() - 1);
        head = new Coord(head.getX() + direction.getX(), head.getY() + direction.getY());
    }

    public void eat(Ball ball) {
        score += ball.getPoints();
    }

    public void updateLength() {
        if (body.size() == Math.floor(Math.sqrt(score))) {
            return;
        }
        if (body.size() < Math.floor(Math.sqrt(score))) {
            body.add(body.get(body.size() - 1));
        } else {
            body.remove(body.size() - 1);
        }
    }
}
