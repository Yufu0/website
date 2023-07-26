package com.celio.chat.snake.game;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
@Component
public class Map {
    private static final Map instance = new Map();

    public Map() {
        for (int i = 0; i < 100; i++) {
            generateBall();
        }
    }

    public static Map getInstance() {
        return instance;
    }
    private int width = 500;
    private int height = 500;

    private List<Player> players = new ArrayList<>();
    private List<Ball> balls = new ArrayList<>();


    public void addPlayer(Player player) {
        players.add(player);
    }

    public void generateBall() {
        balls.add(new Ball(
                new Coord(
                        Math.random() * width,
                        Math.random() * height
                ),
                1 + (int) (Math.random() * 10)
        ));
    }

    public Coord randomCoord() {
        return new Coord(
                100 + Math.random() * (width-100),
                100 + Math.random() * (height-100)
        );
    }

    public void update() {
        for (Player player : players) {
            player.move();
            for (Ball ball : balls) {
                if (player.getHead().equals(ball.getCoord())) {
                    player.eat(ball);
                    balls.remove(ball);
                    generateBall();
                }
            }
            player.updateLength();
        }
    }

    public JSONObject json() {
        JSONObject json = new JSONObject();
        json.put("width", width);
        json.put("height", height);

        JSONArray jsonPlayers = new JSONArray();
        for (Player player : players) {
            jsonPlayers.add(player.json());
        }
        json.put("players", jsonPlayers);
        JSONArray jsonBalls = new JSONArray();
        for (Ball ball : balls) {
            jsonBalls.add(ball.json());
        }
        json.put("balls", jsonBalls);

        return json;
    }

    public void deletePlayer(String username) {
        players.removeIf(player -> player.getName().equals(username));
    }

    public void changePlayer(String name, Coord direction, Coord head, List<Coord> body) {
        for (Player player : players) {
            if (player.getName().equals(name)) {
                player.setDirection(direction);
                player.setHead(head);
                player.setBody(body);
            }
        }
    }
}
