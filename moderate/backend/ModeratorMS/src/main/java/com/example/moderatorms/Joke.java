package com.example.moderatorms;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Joke {
    private String _id;
    private String type;
    private String setup;
    private String punchline;
    private String approvalStatus;
}
