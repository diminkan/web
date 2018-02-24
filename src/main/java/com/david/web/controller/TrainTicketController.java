package com.david.web.controller;

import com.david.web.service.TicketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

/**
 * Created by diminkan on 4/2/2018.
 */
@RestController
public class TrainTicketController {

    private static final Logger logger = LoggerFactory.getLogger(TrainTicketController.class);

    @Autowired
    private TicketService tripService;

    @PostMapping("/ticket/buy")
    @CrossOrigin(origins = "*")
    Mono<Void> buy(@RequestParam("trainDate") String trainDate,
                      @RequestParam("fromStation") String fromStation,
                      @RequestParam("toStation") String toStation,
                      @RequestParam("trainNo") String trainCode) throws Exception {
        tripService.service(fromStation, toStation,trainDate,  trainCode);
        return Mono.empty();
    }

    @GetMapping("/ticket/query")
    @CrossOrigin(origins = "*")
    Mono<List<Map<String,String>>> query(@RequestParam("trainDate") String trainDate,
                          @RequestParam("fromStation") String fromStation,
                          @RequestParam("toStation") String toStation) throws Exception {
        return Mono.just(tripService.queryTrain(fromStation, toStation,trainDate));
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handle(RuntimeException e) {
        return new ErrorResponse(e.getMessage()); // use message from the original exception
    }

    private class ErrorResponse {

        public String message;

        public ErrorResponse(String message) {
            this.message = message;
        }
    }

}
