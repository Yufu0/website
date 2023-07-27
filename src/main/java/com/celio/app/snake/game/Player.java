package com.celio.app.snake.game;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

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

    public Player(String name, Map map) {
        this.name = name;
        this.score = 100;
        this.head = map.randomCoord();
        this.direction = new Coord(0, 0);
        this.body = List.of(head);
    }

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

    public JSONObject json() {
        JSONObject json = new JSONObject();
        json.put("name", name);
        json.put("score", score);
        json.put("head", head.json());
        json.put("direction", direction.json());
        JSONArray jsonBody = new JSONArray();
        for (Coord coord : body) {
            jsonBody.add(coord.json());
        }
        json.put("body", jsonBody);
        return json;
    }
}
