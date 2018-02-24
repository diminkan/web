package com.david.web.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by diminkan on 9/1/2018.
 */
@Document
public class Trip {

    @Id
    private String id;

    private LocalDate fromDate;

    private LocalDate toDate;

    private String destination;

    private String path;

    private String hotel;

    private Map<String, Integer> imageRatings = new HashMap<>();

    @Override
    public String toString() {
        return "Trip{" +
                "id='" + id + '\'' +
                ", fromDate=" + fromDate +
                ", toDate=" + toDate +
                ", destination='" + destination + '\'' +
                ", path='" + path + '\'' +
                ", hotel='" + hotel + '\'' +
                ", imageRatings=" + imageRatings +
                '}';
    }

    public void addRating(String name, int rating) {
        this.imageRatings.put(name, rating);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDate getFromDate() {
        return fromDate;
    }

    public void setFromDate(LocalDate fromDate) {
        this.fromDate = fromDate;
    }

    public LocalDate getToDate() {
        return toDate;
    }

    public void setToDate(LocalDate toDate) {
        this.toDate = toDate;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getHotel() {
        return hotel;
    }

    public void setHotel(String hotel) {
        this.hotel = hotel;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Map<String, Integer> getImageRatings() {
        return imageRatings;
    }

    public void setImageRatings(Map<String, Integer> imageRatings) {
        this.imageRatings = imageRatings;
    }
}
