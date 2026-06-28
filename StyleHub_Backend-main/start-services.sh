#!/bin/bash
# =================================================================
#        STYLEHUB SEQUENTIAL MICROSERVICES STARTUP ORCHESTRATOR
# =================================================================
# This script starts the StyleHub services in waves to prevent
# simultaneous JVM memory spikes on resource-constrained hosts.
# =================================================================

COLOR_RESET="\033[0m"
COLOR_GREEN="\033[32m"
COLOR_BLUE="\033[34m"
COLOR_YELLOW="\033[33m"
COLOR_CYAN="\033[36m"

echo -e "${COLOR_BLUE}================================================================${COLOR_RESET}"
echo -e "${COLOR_BLUE}        STYLEHUB Microservices Wave-based Orchestrator          ${COLOR_RESET}"
echo -e "${COLOR_BLUE}================================================================${COLOR_RESET}"

# Wave 0: Base Infrastructure
echo -e "\n${COLOR_CYAN}[WAVE 0] Starting MySQL & RabbitMQ...${COLOR_RESET}"
docker compose up -d stylehub-mysql rabbitmq
sleep 5

# Start Keycloak
echo -e "\n${COLOR_CYAN}[WAVE 0.5] Starting Keycloak...${COLOR_RESET}"
cd keycloak
docker compose up -d
cd ..

echo -e "${COLOR_YELLOW}Waiting 15 seconds for infrastructure to stabilize...${COLOR_RESET}"
sleep 15

# Wave 1: Eureka Discovery Server
echo -e "\n${COLOR_CYAN}[WAVE 1] Starting Eureka Discovery Server...${COLOR_RESET}"
docker compose up -d eureka-server

echo -e "${COLOR_YELLOW}Waiting 25 seconds for Eureka to start...${COLOR_RESET}"
sleep 25

# Wave 2: Gateway and User Service (Auth Core)
echo -e "\n${COLOR_CYAN}[WAVE 2] Starting User Service & Gateway...${COLOR_RESET}"
docker compose up -d user-service gateway-service

echo -e "${COLOR_YELLOW}Waiting 20 seconds for Core Services to register...${COLOR_RESET}"
sleep 20

# Wave 3: Business services
echo -e "\n${COLOR_CYAN}[WAVE 3] Starting Salon, Category & Offering Services...${COLOR_RESET}"
docker compose up -d salon-service category-service service-offering-service

echo -e "${COLOR_YELLOW}Waiting 20 seconds for Business Services to register...${COLOR_RESET}"
sleep 20

# Wave 4: Booking & Payment Services
echo -e "\n${COLOR_CYAN}[WAVE 4] Starting Booking & Payment Services...${COLOR_RESET}"
docker compose up -d booking-service payment-service

echo -e "\n${COLOR_GREEN}----------------------------------------------------------------${COLOR_RESET}"
echo -e "${COLOR_GREEN}All waves successfully deployed! Waiting for final Discovery registration...${COLOR_RESET}"
echo -e "${COLOR_GREEN}----------------------------------------------------------------${COLOR_RESET}"

sleep 25
bash test-integration-suite.sh
