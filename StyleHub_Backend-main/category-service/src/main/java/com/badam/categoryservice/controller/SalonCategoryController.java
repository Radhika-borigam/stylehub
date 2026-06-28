package com.badam.categoryservice.controller;

import com.badam.categoryservice.entity.Category;
import com.badam.categoryservice.payload.dto.SalonDTO;
import com.badam.categoryservice.service.CategoryService;
import com.badam.categoryservice.service.clients.SalonFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories/salon-owner")
@RequiredArgsConstructor
public class SalonCategoryController {

    private final CategoryService categoryService;
    private final SalonFeignClient salonService;

    @PostMapping
    public ResponseEntity<Category> createCategory(
            @RequestBody Category category,
            @RequestHeader("X-User-Email") String email) throws Exception {
        SalonDTO salon=salonService.getSalonByOwner(email).getBody();
        Category savedCategory = categoryService.saveCategory(category, salon);
        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }
}
