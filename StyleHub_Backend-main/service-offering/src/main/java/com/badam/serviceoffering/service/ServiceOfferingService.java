package com.badam.serviceoffering.service;


import com.badam.serviceoffering.entity.ServiceOffering;
import com.badam.serviceoffering.dto.CategoryDTO;
import com.badam.serviceoffering.dto.SalonDTO;
import com.badam.serviceoffering.dto.ServiceDTO;

import java.util.Set;

public interface ServiceOfferingService {


    ServiceOffering createService(
            ServiceDTO service,
            SalonDTO salon,
            CategoryDTO category
    );

    ServiceOffering updateService(Long serviceId, ServiceOffering service) throws Exception;

    Set<ServiceOffering> getAllServicesBySalonId(Long salonId,Long categoryId);

    ServiceOffering getServiceById(Long serviceId);

    Set<ServiceOffering> getServicesByIds(Set<Long> ids);
}
