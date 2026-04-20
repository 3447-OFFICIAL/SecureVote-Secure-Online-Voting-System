package com.votingsystem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Email or Register Number is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
