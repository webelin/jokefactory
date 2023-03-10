package com.example.moderatorms;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.net.ConnectException;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

@RestController
@RequestMapping("/joke")
@CrossOrigin
public class JokeController {
    private final ObjectMapper mapper = new ObjectMapper();
    private final String submitHostUri = "http://20.90.189.81/";
    private final String deliveryHostUri = "http://20.21.246.173/";

    @GetMapping
    public ResponseEntity<List<Joke>> findAll(@RequestHeader("User") String user) {
        if (!authenticate(new User(user.split(",")[0], user.split(",")[1]))) return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        return new ResponseEntity(Arrays.stream(WebClient.create(submitHostUri + "joke/").get().retrieve().bodyToMono(Joke[].class).block()).toList(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Joke> findOne(@PathVariable("id") String id, @RequestHeader("User") String user) {
        if (!authenticate(new User(user.split(",")[0], user.split(",")[1]))) return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        return new ResponseEntity(WebClient.create(submitHostUri + "joke/" + id).get().retrieve().bodyToMono(Joke.class).block(), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteOne(@PathVariable("id") String id, @RequestHeader("User") String user) {
        if (!authenticate(new User(user.split(",")[0], user.split(",")[1]))) return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        mapper.enable(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY);
        System.out.println(submitHostUri + "joke/" + id);
        return new ResponseEntity(WebClient.create(submitHostUri + "joke/" + id).delete().retrieve().bodyToMono(Boolean.class).block(), HttpStatus.OK);
    }

    private ResponseEntity<Boolean> changeApprovalStatus(String id, String approvalStatus, @RequestHeader("User") String user) {
        if (!authenticate(new User(user.split(",")[0], user.split(",")[1]))) return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        try {
            Joke joke = WebClient.create(String.format("%s/joke/%s/%s", submitHostUri, approvalStatus, id))
                    .put()
                    .retrieve()
                    .bodyToMono(Joke.class)
                    .block();
            return new ResponseEntity(true, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity(false, HttpStatus.OK);
        }
    }

    @GetMapping("/accept/{id}")
    public ResponseEntity<Boolean> acceptJoke(@RequestHeader("User") String user, @PathVariable("id") String id) {
        if (!authenticate(new User(user.split(",")[0], user.split(",")[1]))) return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        System.out.println(id);
        Joke joke = WebClient.create(submitHostUri + "joke/" + id).get().retrieve().bodyToMono(Joke.class).block();
        if (joke != null) {
            String body = "{\"type\":" + joke.getType() +  ", \"setup\":\"" + joke.getSetup() + "\", \"punchline\":\"" + joke.getPunchline() + "\"}";

            String res = WebClient.create(deliveryHostUri + "/joke")
                    .post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (res != null) {
                return changeApprovalStatus(id, "approved", user);
            }
            else throw new NoSuchElementException();
        }
        else throw new NoSuchElementException();
    }

    @GetMapping("/reject/{id}")
    public ResponseEntity<Boolean> rejectJoke(@PathVariable("id") String id, @RequestHeader("User") String user) {
        if (!authenticate(new User(user.split(",")[0], user.split(",")[1]))) return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        return WebClient.create(submitHostUri + "joke/" + id).delete().retrieve().bodyToMono(Boolean.class).block() ? changeApprovalStatus(id, "declined", user) : new ResponseEntity(false, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Boolean> updateJoke(@PathVariable("id") String id, @RequestBody JokeUpdateDTO joke, @RequestHeader("User") String user) {
        if (!authenticate(new User(user.split(",")[0], user.split(",")[1]))) return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        try {
            String body = "{\"type\":" + joke.getType() +  ", \"setup\":\"" + joke.getSetup() + "\", \"punchline\":\"" + joke.getPunchline() + "\"}";
            Joke res = WebClient.create(submitHostUri + "/joke/" + id)
                    .put()
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Joke.class)
                    .block();
            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(false, HttpStatus.OK);
        }
    }

    @GetMapping("/types")
    public ResponseEntity<List<Type>> getTypes(@RequestHeader("User") String user) {
        if (!authenticate(new User(user.split(",")[0], user.split(",")[1]))) return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        return new ResponseEntity(List.of(WebClient.create(deliveryHostUri + "gettypes")
                .get()
                .retrieve()
                .bodyToMono(Type[].class)
                .block()), HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<Boolean> login(@RequestBody User user) {
        if (!authenticate(user)) return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        return new ResponseEntity<>(true, HttpStatus.OK);
    }

    public boolean authenticate(User user) {
        System.out.println(user.toString());
        return Objects.equals(user.getUsername(), "admin") && Objects.equals(user.getPassword(), "admin");
    }
}
