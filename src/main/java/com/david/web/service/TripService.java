package com.david.web.service;

import com.david.web.model.Rating;
import com.david.web.model.Trip;
import com.david.web.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static com.david.web.controller.TripController.isImage;
import static java.util.stream.Collectors.toList;

/**
 * Created by diminkan on 23/1/2018.
 */
@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    public Mono<Trip> rateImage(String id, String name, int rate) {
        return tripRepository.findById(id).map(
                trip -> {
                    Rating rating = new Rating();
                    rating.setName(name);
                    rating.setRating(rate);
                    trip.addRating(name.replaceAll("\\.","&"),rate);
                    return trip;
                }).flatMap(trip -> tripRepository.save(trip));
    }

    public Mono<Integer> getRating(String id,String name) {
        return tripRepository.findById(id).map(
                trip -> trip.getImageRatings().containsKey(name.replaceAll("\\.","&")) ? trip.getImageRatings().get(name.replaceAll("\\.","&")) : 0);
    }

    public Mono<List<String>> getAllFileNames(String path) {
        return Mono.fromSupplier(()->{
            List<String> fileNames;
            try {
                fileNames = Files.list(Paths.get(path)).filter(p -> !p.getFileName().toString().startsWith(".") && isImage(p.toAbsolutePath().toString())).map(Path::getFileName).map(Path::toString)
                        .collect(toList());
            } catch (IOException e) {
                return null;
            }
            return fileNames;
        });
    }

    @Cacheable
    public Mono<Resource> getImage(String path, String name) {
        return Mono.fromSupplier( () -> {
            Path inputFile = Paths.get(path, name);

            try {
                return new ByteArrayResource(Files.readAllBytes(inputFile));
            } catch (IOException e) {
                return null;
            }
        });
    }
}
