package com.celio.app.snake;

import com.celio.app.message.Message;
import com.celio.app.message.MessageType;
import com.celio.app.snake.game.Map;
import com.celio.app.snake.game.Player;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

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
