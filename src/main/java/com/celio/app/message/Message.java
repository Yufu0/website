package com.celio.app.message;

import lombok.*;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {
    private String sender;
    private String content;
    private MessageType type;
}
