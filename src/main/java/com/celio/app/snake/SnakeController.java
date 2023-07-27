package com.celio.app.snake;

import com.celio.app.message.Message;
import com.celio.app.message.MessageType;
import com.celio.app.snake.game.Ball;
import com.celio.app.snake.game.Coord;
import com.celio.app.snake.game.Map;
import com.celio.app.snake.game.Player;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import org.json.simple.parser.ParseException;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import java.util.stream.Collectors;

@Controller
public class SnakeController {
    @GetMapping("/snake")
    public String snake() {
        return "snake";
    }

    @MessageMapping("/snake.changePosition")
    @SendTo("/snake/public")
    public Message changePosition(
            @Payload Message message
    ) {
        /*
        // change direction of player
        JSONParser jsonParser = new JSONParser();
        try {
            JSONObject jsonPlayer = (JSONObject) jsonParser.parse(message.getContent());
            System.out.println(jsonPlayer);
            JSONObject jsonDirection = (JSONObject) jsonPlayer.get("direction");
            JSONObject jsonHead = (JSONObject) jsonPlayer.get("head");
            JSONArray jsonBody = (JSONArray)  jsonPlayer.get("body");

            Map.getInstance().changePlayer(
                    message.getSender(),
                    new Coord(
                            Double.valueOf((Long) jsonDirection.get("x")),
                            Double.valueOf((Long) jsonDirection.get("y"))
                    ),
                    new Coord(
                            (double) jsonHead.get("x"),
                            (double) jsonHead.get("y")
                    ),
                    (List<Coord>) jsonBody.stream().map(o -> {
                        JSONObject jsonCoord = (JSONObject) o;
                        return new Coord(
                                (double) jsonCoord.get("x"),
                                (double) jsonCoord.get("y")
                        );
                    }).collect(Collectors.toList())
            );
        } catch (ParseException e) {
            e.printStackTrace();
        }*/
        return message;
    }

    @MessageMapping("/snake.addPlayer")
    @SendTo("/snake/public")
    public Message addUser(
            @Payload Message message,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        headerAccessor.getSessionAttributes().put("username", message.getSender());

        // add player to map
        Map map = Map.getInstance();
        map.addPlayer(new Player(message.getSender(), map));


        return new Message(
                message.getSender(),
                map.json().toString(),
                MessageType.UPDATE
        );
    }
}
