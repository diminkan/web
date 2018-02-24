package com.david.web;

import com.david.web.model.User;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.stereotype.Component;

@SpringBootApplication
public class WebApplication {

	@Component
	public class InitDatabase {
		@Bean
		CommandLineRunner init(MongoOperations operations) {
			return args -> {
				operations.dropCollection(User.class);

				User user = new User();
				user.setUsername("david");
				user.setPassword("david");
				operations.insert(user);


			};
		}
	}



	@SuppressWarnings("deprecation")
	@Bean
	public static NoOpPasswordEncoder passwordEncoder() {
		return (NoOpPasswordEncoder) NoOpPasswordEncoder.getInstance();
	}


	@Bean
	public HttpClient httpClient() {
		return HttpClients.createDefault();
	}

	public static void main(String[] args) {
		SpringApplication.run(WebApplication.class, args);
	}
}
