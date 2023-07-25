package com.celio.chat.snake;

import com.celio.chat.message.Message;
import com.celio.chat.snake.game.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SnakeController {
    @Autowired
    private Map map;

    @GetMapping("/snake")
    public String snake() {
        return "snake";
    }

    @MessageMapping("/snake.changeDirection")
    @SendTo("/snake/public")
    public Message changeDirection(
            Message message
    ) {
        // update map
        System.out.println(message.getContent());
        return message;
    }

    @MessageMapping("/snake.addPlayer")
    @SendTo("/snake/public")
    public Message addUser(
            @Payload Message message,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        return new Message(
                message.getSender(),
                map.jsonMap(),
                message.getType()
        );
    }
}
