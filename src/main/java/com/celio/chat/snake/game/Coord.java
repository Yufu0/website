package com.celio.chat.snake.game;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.json.simple.JSONObject;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Coord {
    private double x;
    private double y;

    public JSONObject json() {
        JSONObject json = new JSONObject();
        json.put("x", x);
        json.put("y", y);
        return json;
    }
}
