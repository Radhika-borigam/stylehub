package com.badam.paymentservice.service.clients;

import com.badam.paymentservice.exception.UserException;
import com.badam.paymentservice.payload.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient("USER-SERVICE")
public interface UserFeignClient {

    @GetMapping("/api/users/profile/email")
    public ResponseEntity<UserDTO> getUserByEmail(
            @RequestParam("email") String email) throws UserException;
}
