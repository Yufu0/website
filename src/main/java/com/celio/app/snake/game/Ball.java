package com.celio.app.snake.game;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.json.simple.JSONObject;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Ball {
    private Coord coord;
    private int points;

    public JSONObject json() {
        JSONObject json = new JSONObject();
        json.put("coord", coord.json());
        json.put("points", points);
        return json;
    }
}
