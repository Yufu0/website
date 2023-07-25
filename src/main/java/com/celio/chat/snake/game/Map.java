package com.celio.chat.snake.game;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
@Component
public class Map {
    private int width = 1280;
    private int height = 720;

    private List<Player> players = new ArrayList<>();
    private List<Ball> balls = new ArrayList<>();


    public void addPlayer(Player player) {
        players.add(player);
    }

    public void generateBall() {
        balls.add(new Ball(new Coord(0, 0), 1));
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

    public String jsonMap() {
        String json = "{\"width\": " + width + ", \"height\": " + height + ", \"players\": [";
        if (players.size() > 0) {
            for (Player player : players) {
                json += "{\"name\": \"" + player.getName() + "\", \"score\": " + player.getScore() + ", \"head\": {\"x\": " + player.getHead().getX() + ", \"y\": " + player.getHead().getY() + "}, \"direction\": {\"x\": " + player.getDirection().getX() + ", \"y\": " + player.getDirection().getY() + "}, \"body\": [";
                for (Coord coord : player.getBody()) {
                    json += "{\"x\": " + coord.getX() + ", \"y\": " + coord.getY() + "},";
                }
                json = json.substring(0, json.length() - 1);
                json += "]}";
            }
        }
        json += "], \"balls\": [";
        if (balls.size() > 0) {
            for (Ball ball : balls) {
                json += "{\"coord\": {\"x\": " + ball.getCoord().getX() + ", \"y\": " + ball.getCoord().getY() + "}, \"points\": " + ball.getPoints() + "},";
            }
            json = json.substring(0, json.length() - 1);
        }
        json += "]}";
        return json;
    }
}
