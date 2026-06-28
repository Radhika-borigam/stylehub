package com.badam.userservice.controller;

import com.badam.userservice.entity.User;
import com.badam.userservice.exception.UserException;
import com.badam.userservice.mapper.UserMapper;
import com.badam.userservice.payload.dto.UserDTO;
import com.badam.userservice.repository.UserRepository;
import com.badam.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getUserFromJwtToken(
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.getUserFromJwtToken(jwt);
        UserDTO userDTO=userMapper.mapToDTO(user);
        return new ResponseEntity<>(userDTO,HttpStatus.OK);
    }

    @GetMapping("/profile/email")
    public ResponseEntity<UserDTO> getUserByEmail(
            @RequestParam("email") String email) throws Exception {
        User user = userService.getUserByEmail(email);
        UserDTO userDTO = userMapper.mapToDTO(user);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId)
            throws UserException {
        User user = userService.getUserById(userId);
        if(user==null) {
            throw new UserException("User not found");
        }
        UserDTO userDTO=userMapper.mapToDTO(user);
        return new ResponseEntity<>(userDTO,HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<User>> getUsers() throws UserException {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users,HttpStatus.OK);
    }

}

