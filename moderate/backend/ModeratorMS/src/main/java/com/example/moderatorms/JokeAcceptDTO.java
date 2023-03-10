package com.example.moderatorms;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class JokeAcceptDTO {
    private String type;
    private String setup;
    private String punchline;

    public static JokeAcceptDTO convert(Joke joke) {
        return new JokeAcceptDTO(joke.getType(), joke.getSetup(), joke.getPunchline());
    }
}
