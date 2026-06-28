package com.badam.userservice.service.impl;

import com.badam.userservice.entity.User;
import com.badam.userservice.exception.UserException;
import com.badam.userservice.payload.dto.KeycloakUserinfo;
import com.badam.userservice.repository.UserRepository;
import com.badam.userservice.service.KeycloakUserService;
import com.badam.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;
    private final KeycloakUserService keycloakUserService;



    @Override
    public User getUserByEmail(String email) throws UserException {
        User user=userRepository.findByEmail(email);
        if(user==null){
            throw new UserException("User not found with email: "+email);
        }
        return user;
    }

    @Override
    public User getUserFromJwtToken(String jwt) throws Exception {
        KeycloakUserinfo userinfo = keycloakUserService.fetchUserProfileByJwt(jwt);
        return userRepository.findByEmail(userinfo.getEmail());
    }

    @Override
    public User getUserById(Long id) throws UserException {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


}

