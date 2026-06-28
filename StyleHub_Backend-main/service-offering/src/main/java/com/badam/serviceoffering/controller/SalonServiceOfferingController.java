package com.badam.serviceoffering.controller;


import com.badam.serviceoffering.entity.ServiceOffering;
import com.badam.serviceoffering.dto.CategoryDTO;
import com.badam.serviceoffering.dto.SalonDTO;
import com.badam.serviceoffering.dto.ServiceDTO;
import com.badam.serviceoffering.service.ServiceOfferingService;
import com.badam.serviceoffering.service.clients.CategoryFeignClient;
import com.badam.serviceoffering.service.clients.SalonFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/service-offering/salon-owner")
public class SalonServiceOfferingController {

    private final ServiceOfferingService serviceOfferingService;
    private final SalonFeignClient salonService;
    private final CategoryFeignClient categoryService;

    @PostMapping
    public ResponseEntity<ServiceOffering> createService(
            @RequestHeader("X-User-Email") String email,
            @RequestBody ServiceDTO service) throws Exception {

        SalonDTO salon=salonService.getSalonByOwner(email).getBody();

        CategoryDTO category=categoryService
                .getCategoryById(service.getCategory()).getBody();

        ServiceOffering createdService = serviceOfferingService
                .createService(service,salon,category);
        return new ResponseEntity<>(createdService, HttpStatus.CREATED);
    }

    @PatchMapping("/{serviceId}")
    public ResponseEntity<ServiceOffering> updateService(
            @PathVariable Long serviceId,
            @RequestBody ServiceOffering service) throws Exception {
        ServiceOffering updatedService = serviceOfferingService
                .updateService(serviceId, service);
        if (updatedService != null) {
            return new ResponseEntity<>(updatedService, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

}
