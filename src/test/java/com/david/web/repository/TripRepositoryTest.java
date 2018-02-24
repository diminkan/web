package com.david.web.repository;

import com.david.web.model.Trip;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;


/**
 * Created by diminkan on 9/1/2018.
 */
@RunWith(SpringRunner.class)
@DataMongoTest
public class TripRepositoryTest {

    @Autowired
    private TripRepository tripRepository;

    @Test
    public void testInsert() {
        Trip trip = new Trip();
        tripRepository.save(trip).block();
        assertThat(tripRepository.findAll().collectList().block()).hasSize(1);
    }

}