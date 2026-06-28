package com.badam.gatewayservice.config;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class UserContextGatewayFilterFactory extends AbstractGatewayFilterFactory<UserContextGatewayFilterFactory.Config> {

    public UserContextGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            return exchange.getPrincipal()
                    .cast(org.springframework.security.core.Authentication.class)
                    .flatMap(authentication -> {
                        // Check if the principal is a JWT token
                        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.oauth2.jwt.Jwt) {
                            var jwt = (org.springframework.security.oauth2.jwt.Jwt) authentication.getPrincipal();

                            // Extract claims from the JWT
                            String email = jwt.getClaimAsString("email");

                            // Add extracted details to request headers for downstream services
                            var mutatedRequest = exchange.getRequest().mutate()
                                    .header("X-User-Email", email)
                                    .build();
                            return chain.filter(exchange.mutate().request(mutatedRequest).build());
                        }
                        return chain.filter(exchange);
                    })
                    .switchIfEmpty(Mono.defer(() -> chain.filter(exchange))); // Fallback for unauthenticated requests (like signup/login)
        };
    }

    public static class Config {
        // Filter-specific configurations can be added here if needed
    }
}
