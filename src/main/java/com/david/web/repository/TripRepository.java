package com.david.web.repository;

import com.david.web.model.Trip;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by diminkan on 9/1/2018.
 */
@Repository
public interface TripRepository extends ReactiveMongoRepository<Trip, String> {

}
