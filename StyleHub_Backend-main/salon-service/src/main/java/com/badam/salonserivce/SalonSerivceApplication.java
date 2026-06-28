package com.badam.salonserivce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class SalonSerivceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalonSerivceApplication.class, args);
	}

}
