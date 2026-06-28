package com.badam.userservice.service;


import com.badam.userservice.entity.User;
import com.badam.userservice.exception.UserException;

import java.util.List;


public interface UserService {
    User getUserByEmail(String email) throws UserException;
    User getUserFromJwtToken(String jwt) throws Exception;
    User getUserById(Long id) throws UserException;
    List<User> getAllUsers();

}
