package com.david.web.controller;

import com.david.web.model.Trip;
import com.david.web.repository.TripRepository;
import com.david.web.service.TripService;
import org.reactivestreams.Publisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import javax.activation.MimetypesFileTypeMap;
import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.List;

/**
 * Created by diminkan on 14/1/2018.
 */
@RestController
public class TripController {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private TripService tripService;

    @PostMapping("/trip/rate")
    @CrossOrigin(origins = "*")
    Mono<Trip> rateImage(@RequestParam("id") final String id,
                         @RequestParam("name") final String name,
                         @RequestParam("rating") final int rating) {
        return this.tripService.rateImage(id, name, rating);
    }

    @GetMapping("/trip/rate")
    @CrossOrigin(origins = "*")
    Mono<Integer> rateImage(@RequestParam("id") final String id,
                         @RequestParam("name") final String name){
        return this.tripService.getRating(id, name);
    }

    @PostMapping("/trip")
    @CrossOrigin(origins = "*")
    Mono<Void> createTrip(@RequestBody Publisher<Trip> tripPublisher) {
        return this.tripRepository.saveAll(tripPublisher).then();
    }

    @GetMapping("/trip")
    @CrossOrigin(origins = "*")
    Flux<Trip> getTrips() {
        return this.tripRepository.findAll();
    }


    @DeleteMapping("/trip/{id}")
    @CrossOrigin(origins = "*")
    public Mono<Void> deleteTrip(@PathVariable("id") final String id) {
        return this.tripRepository.deleteById(id).then();
    }

    @GetMapping("/files")
    @CrossOrigin(origins = "*")
    public Mono<List<String>> getAllFileNames(@RequestParam("path") final String path){
        return tripService.getAllFileNames(path);

    }

    @GetMapping(value="/file" ,produces = MediaType.IMAGE_JPEG_VALUE)
    @CrossOrigin(origins = "*")
    Mono<Resource> file(@RequestParam("path") final String path,
                        @RequestParam("name") final String name){

        return tripService.getImage(path,name);
    }

    public static boolean isImage(String fileName){
        MimetypesFileTypeMap mimeTypesMap = new MimetypesFileTypeMap();

       String mimeType = mimeTypesMap.getContentType(fileName);

       return mimeType.startsWith("image");
    }

    public static byte[] resize(String inputImagePath,
                              int scaledWidth, int scaledHeight) throws IOException {
        // reads input image
        File inputFile = new File(inputImagePath);
        BufferedImage inputImage = ImageIO.read(inputFile);

        // creates output image
        BufferedImage outputImage = new BufferedImage(scaledWidth,
                scaledHeight, inputImage.getType());

        // scales the input image to the output image
        Graphics2D g2d = outputImage.createGraphics();
        g2d.drawImage(inputImage, 0, 0, scaledWidth, scaledHeight, null);
        g2d.dispose();


        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(outputImage, "jpg", baos);
        return baos.toByteArray();
    }
}
