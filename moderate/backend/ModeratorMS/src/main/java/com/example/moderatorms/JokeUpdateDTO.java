package com.example.moderatorms;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class JokeUpdateDTO {
    private String type;
    private String setup;
    private String punchline;
}
