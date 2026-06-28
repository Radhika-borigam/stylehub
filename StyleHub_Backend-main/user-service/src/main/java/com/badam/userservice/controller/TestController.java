package com.badam.userservice.controller;

import com.badam.userservice.payload.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/users/test")
    public ResponseEntity<ApiResponse> HomeControllerHandler() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ApiResponse(
                        "Welcome to StlyeHub, USER_API_SERVICE"));
    }
}

