package com.badam.reviewservice.service.clients;

import com.badam.reviewservice.exception.UserException;
import com.badam.reviewservice.payload.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient("USER-SERVICE")
public interface UserFeignClient {

    @GetMapping("/api/users/profile/email")
    public ResponseEntity<UserDTO> getUserByEmail(
            @RequestParam("email") String email)
            throws UserException;

    @GetMapping("/api/users/{userId}")
    public ResponseEntity<UserDTO> getUserById(
            @PathVariable Long userId
    ) throws UserException;
}
