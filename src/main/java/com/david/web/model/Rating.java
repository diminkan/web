package com.david.web.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Rating {

    private String name;

    private int rating;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}
