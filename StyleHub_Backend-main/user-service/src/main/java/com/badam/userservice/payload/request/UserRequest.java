package com.badam.userservice.payload.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UserRequest {

    private String username;
    
    @JsonProperty("enabled")
    private Boolean enabled;
    
    private String firstName;
    private String lastName;
    private String email;
    
    @JsonProperty("emailVerified")
    private Boolean emailVerified;
    
    private List<Credential> credentials = new ArrayList<>();
    private List<String> realmRoles = new ArrayList<>();
}
