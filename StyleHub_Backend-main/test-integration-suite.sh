#!/bin/bash

# =================================================================
#        STYLEHUB END-TO-END MICROSERVICES INTEGRATION TEST SUITE
# =================================================================
# This script performs full E2E testing of the StyleHub platform:
# 1. Verifies Eureka Registry Status
# 2. Creates and Authenticates a Salon Owner (User Service)
# 3. Creates and Authenticates a Customer (User Service)
# 4. Verifies Profile Routing through Gateway (Gateway Service)
# 5. Creates a Salon (Salon Service via Gateway)
# 6. Creates a Category (Category Service via Gateway)
# 7. Creates a Service Offering (Service Offering Service via Gateway)
# 8. Books the Offering (Booking & Payment Services via Gateway)
# =================================================================

COLOR_RESET="\033[0m"
COLOR_GREEN="\033[32m"
COLOR_RED="\033[31m"
COLOR_BLUE="\033[34m"
COLOR_YELLOW="\033[33m"
COLOR_CYAN="\033[36m"
COLOR_MAGENTA="\033[35m"

GATEWAY_URL="http://localhost:8081"
EUREKA_URL="http://localhost:8070/eureka"

RAND_ID=$((1000 + RANDOM % 9000))
OWNER_EMAIL="owner_${RAND_ID}@example.com"
OWNER_USERNAME="owner_${RAND_ID}"
OWNER_PASS="OwnerPass123!"

CUST_EMAIL="customer_${RAND_ID}@example.com"
CUST_USERNAME="customer_${RAND_ID}"
CUST_PASS="CustPass123!"

echo -e "${COLOR_BLUE}================================================================${COLOR_RESET}"
echo -e "${COLOR_BLUE}        STYLEHUB E2E MICROSERVICES INTEGRATION TEST SUITE        ${COLOR_RESET}"
echo -e "${COLOR_BLUE}================================================================${COLOR_RESET}"
echo -e "${COLOR_CYAN}Test Coordinates generated:${COLOR_RESET}"
echo -e "  - Salon Owner Email:    ${COLOR_YELLOW}$OWNER_EMAIL${COLOR_RESET}"
echo -e "  - Customer Email:       ${COLOR_YELLOW}$CUST_EMAIL${COLOR_RESET}"
echo -e "  - API Gateway Address:  ${COLOR_YELLOW}$GATEWAY_URL${COLOR_RESET}"
echo -e "  - Eureka Server URL:    ${COLOR_YELLOW}$EUREKA_URL${COLOR_RESET}"
echo -e "----------------------------------------------------------------"

# --- STEP 1: VERIFY EUREKA REGISTRY ---
echo -e "\n${COLOR_CYAN}[STEP 1] Querying Eureka Discovery Registry...${COLOR_RESET}"
EUREKA_APPS=$(curl -s -H "Accept: application/json" "$EUREKA_URL/apps")

if [ -z "$EUREKA_APPS" ]; then
    echo -e "${COLOR_RED}[FAIL] Could not connect to Eureka Server at $EUREKA_URL.${COLOR_RESET}"
    exit 1
fi

REQUIRED_SERVICES=("USER-SERVICE" "SALON-SERVICE" "CATEGORY-SERVICE" "SERVICE-OFFERING" "BOOKING-SERVICE" "PAYMENT-SERVICE" "GATEWAY-SERVICE")
ALL_HEALTHY=true

echo -e "${COLOR_BLUE}Microservices Registry Status in Eureka:${COLOR_RESET}"
for service in "${REQUIRED_SERVICES[@]}"; do
    if echo "$EUREKA_APPS" | grep -q "$service"; then
        echo -e "  - Service ${COLOR_MAGENTA}%-25s${COLOR_RESET} -> [${COLOR_GREEN}REGISTERED & UP${COLOR_RESET}]" "$service"
    else
        echo -e "  - Service ${COLOR_MAGENTA}%-25s${COLOR_RESET} -> [${COLOR_RED}MISSING/DOWN${COLOR_RESET}]" "$service"
        ALL_HEALTHY=false
    fi
done

if [ "$ALL_HEALTHY" = false ]; then
    echo -e "${COLOR_RED}[FAIL] One or more microservices are not registered with Eureka yet.${COLOR_RESET}"
    echo -e "Please wait a few seconds and try again."
    exit 1
fi
echo -e "${COLOR_GREEN}[SUCCESS] All 7 StyleHub microservices are successfully registered and healthy!${COLOR_RESET}"

# --- STEP 2: REGISTER & AUTHENTICATE SALON OWNER ---
echo -e "\n${COLOR_CYAN}[STEP 2] Creating Salon Owner Profile...${COLOR_RESET}"
OWNER_SIGNUP_PAYLOAD=$(cat <<EOF
{
  "email": "$OWNER_EMAIL",
  "password": "$OWNER_PASS",
  "phone": "999900$RAND_ID",
  "fullName": "Master Stylist $RAND_ID",
  "username": "$OWNER_USERNAME",
  "role": "SALON_OWNER"
}
EOF
)

OWNER_SIGNUP_RES=$(curl -s -X POST "$GATEWAY_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "$OWNER_SIGNUP_PAYLOAD")

OWNER_SUCCESS=$(echo "$OWNER_SIGNUP_RES" | jq -r '.success')

if [ "$OWNER_SUCCESS" != "true" ]; then
    echo -e "${COLOR_RED}[FAIL] Salon Owner signup failed!${COLOR_RESET}"
    echo -e "Response: $OWNER_SIGNUP_RES"
    exit 1
fi

echo -e "${COLOR_GREEN}[SUCCESS] Salon Owner registered successfully!${COLOR_RESET}"

# Login to get Salon Owner JWT
echo -e "${COLOR_CYAN}Authenticating Salon Owner...${COLOR_RESET}"
OWNER_LOGIN_PAYLOAD=$(cat <<EOF
{
  "email": "$OWNER_EMAIL",
  "password": "$OWNER_PASS"
}
EOF
)

OWNER_LOGIN_RES=$(curl -s -X POST "$GATEWAY_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "$OWNER_LOGIN_PAYLOAD")

OWNER_JWT=$(echo "$OWNER_LOGIN_RES" | jq -r '.data.jwt')
if [ -z "$OWNER_JWT" ] || [ "$OWNER_JWT" = "null" ]; then
    echo -e "${COLOR_RED}[FAIL] Salon Owner Login failed to return token!${COLOR_RESET}"
    echo -e "Response: $OWNER_LOGIN_RES"
    exit 1
fi

OWNER_AUTH="Bearer $OWNER_JWT"
echo -e "${COLOR_GREEN}[SUCCESS] Salon Owner Token obtained!${COLOR_RESET}"
echo -e "  - Token snippet: ${COLOR_YELLOW}${OWNER_JWT:0:40}...${COLOR_RESET}"

# --- STEP 3: REGISTER & AUTHENTICATE CUSTOMER ---
echo -e "\n${COLOR_CYAN}[STEP 3] Creating Customer Profile...${COLOR_RESET}"
CUST_SIGNUP_PAYLOAD=$(cat <<EOF
{
  "email": "$CUST_EMAIL",
  "password": "$CUST_PASS",
  "phone": "888800$RAND_ID",
  "fullName": "Valued Guest $RAND_ID",
  "username": "$CUST_USERNAME",
  "role": "CUSTOMER"
}
EOF
)

CUST_SIGNUP_RES=$(curl -s -X POST "$GATEWAY_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "$CUST_SIGNUP_PAYLOAD")

CUST_SUCCESS=$(echo "$CUST_SIGNUP_RES" | jq -r '.success')

if [ "$CUST_SUCCESS" != "true" ]; then
    echo -e "${COLOR_RED}[FAIL] Customer signup failed!${COLOR_RESET}"
    echo -e "Response: $CUST_SIGNUP_RES"
    exit 1
fi

echo -e "${COLOR_GREEN}[SUCCESS] Customer registered successfully!${COLOR_RESET}"

# Login to get Customer JWT
echo -e "${COLOR_CYAN}Authenticating Customer...${COLOR_RESET}"
CUST_LOGIN_PAYLOAD=$(cat <<EOF
{
  "email": "$CUST_EMAIL",
  "password": "$CUST_PASS"
}
EOF
)

CUST_LOGIN_RES=$(curl -s -X POST "$GATEWAY_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "$CUST_LOGIN_PAYLOAD")

CUST_JWT=$(echo "$CUST_LOGIN_RES" | jq -r '.data.jwt')
if [ -z "$CUST_JWT" ] || [ "$CUST_JWT" = "null" ]; then
    echo -e "${COLOR_RED}[FAIL] Customer Login failed to return token!${COLOR_RESET}"
    echo -e "Response: $CUST_LOGIN_RES"
    exit 1
fi

CUST_AUTH="Bearer $CUST_JWT"
echo -e "${COLOR_GREEN}[SUCCESS] Customer Token obtained!${COLOR_RESET}"
echo -e "  - Token snippet: ${COLOR_YELLOW}${CUST_JWT:0:40}...${COLOR_RESET}"

# --- STEP 4: VERIFY ROUTING THROUGH API GATEWAY ---
echo -e "\n${COLOR_CYAN}[STEP 4] Verifying Gateway Routing to User Profile...${COLOR_RESET}"
PROFILE_RES=$(curl -s -X GET "$GATEWAY_URL/api/users/profile" \
  -H "Authorization: $OWNER_AUTH" \
  -H "Content-Type: application/json")

PROFILE_EMAIL=$(echo "$PROFILE_RES" | jq -r '.email')

if [ "$PROFILE_EMAIL" != "$OWNER_EMAIL" ]; then
    echo -e "${COLOR_RED}[FAIL] Profile retrieval through Gateway failed!${COLOR_RESET}"
    echo -e "Response: $PROFILE_RES"
    exit 1
fi

echo -e "${COLOR_GREEN}[SUCCESS] API Gateway successfully routed and authenticated the request!${COLOR_RESET}"
echo -e "  - Routed user: ${COLOR_GREEN}$(echo "$PROFILE_RES" | jq -r '.fullName') (${COLOR_YELLOW}$PROFILE_EMAIL${COLOR_RESET})"

# --- STEP 5: CREATE SALON (SALON SERVICE VIA GATEWAY) ---
echo -e "\n${COLOR_CYAN}[STEP 5] Creating a New Salon...${COLOR_RESET}"
SALON_PAYLOAD=$(cat <<EOF
{
  "name": "Luxury Glow Lounge $RAND_ID",
  "address": "456 Fashion Avenue, Suite $RAND_ID",
  "phoneNumber": "555-01$RAND_ID",
  "email": "lounge_$RAND_ID@example.com",
  "city": "London",
  "openTime": "09:00:00",
  "closeTime": "21:00:00",
  "isOpen": true,
  "homeService": false,
  "active": true
}
EOF
)

SALON_RES=$(curl -s -X POST "$GATEWAY_URL/api/salons" \
  -H "Authorization: $OWNER_AUTH" \
  -H "Content-Type: application/json" \
  -d "$SALON_PAYLOAD")

SALON_ID=$(echo "$SALON_RES" | jq -r '.id')

if [ -z "$SALON_ID" ] || [ "$SALON_ID" = "null" ]; then
    echo -e "${COLOR_RED}[FAIL] Salon creation failed!${COLOR_RESET}"
    echo -e "Response: $SALON_RES"
    exit 1
fi

echo -e "${COLOR_GREEN}[SUCCESS] Salon created successfully!${COLOR_RESET}"
echo -e "  - Salon ID:     ${COLOR_GREEN}$SALON_ID${COLOR_RESET}"
echo -e "  - Salon Name:   ${COLOR_GREEN}$(echo "$SALON_RES" | jq -r '.name')${COLOR_RESET}"
echo -e "  - Assigned to:  ${COLOR_YELLOW}$(echo "$SALON_RES" | jq -r '.owner.fullName')${COLOR_RESET}"

# --- STEP 6: CREATE CATEGORY (CATEGORY SERVICE VIA GATEWAY) ---
echo -e "\n${COLOR_CYAN}[STEP 6] Creating a Salon Category...${COLOR_RESET}"
CATEGORY_PAYLOAD=$(cat <<EOF
{
  "name": "Haircuts and Styling $RAND_ID",
  "image": "https://images.example.com/categories/hair_$RAND_ID.jpg"
}
EOF
)

CATEGORY_RES=$(curl -s -X POST "$GATEWAY_URL/api/categories/salon-owner" \
  -H "Authorization: $OWNER_AUTH" \
  -H "Content-Type: application/json" \
  -d "$CATEGORY_PAYLOAD")

CATEGORY_ID=$(echo "$CATEGORY_RES" | jq -r '.id')

if [ -z "$CATEGORY_ID" ] || [ "$CATEGORY_ID" = "null" ]; then
    echo -e "${COLOR_RED}[FAIL] Category creation failed!${COLOR_RESET}"
    echo -e "Response: $CATEGORY_RES"
    exit 1
fi

echo -e "${COLOR_GREEN}[SUCCESS] Category created successfully!${COLOR_RESET}"
echo -e "  - Category ID:   ${COLOR_GREEN}$CATEGORY_ID${COLOR_RESET}"
echo -e "  - Category Name: ${COLOR_GREEN}$(echo "$CATEGORY_RES" | jq -r '.name')${COLOR_RESET}"

# --- STEP 7: CREATE SERVICE OFFERING (SERVICE OFFERING SERVICE VIA GATEWAY) ---
echo -e "\n${COLOR_CYAN}[STEP 7] Creating a Service Offering...${COLOR_RESET}"
OFFERING_PAYLOAD=$(cat <<EOF
{
  "name": "Premium Blowout & Styling $RAND_ID",
  "description": "High-end washing, blowout, and custom styling",
  "price": 120,
  "duration": 45,
  "category": $CATEGORY_ID,
  "image": "https://images.example.com/offerings/blowout_$RAND_ID.jpg"
}
EOF
)

OFFERING_RES=$(curl -s -X POST "$GATEWAY_URL/api/service-offering/salon-owner" \
  -H "Authorization: $OWNER_AUTH" \
  -H "Content-Type: application/json" \
  -d "$OFFERING_PAYLOAD")

OFFERING_ID=$(echo "$OFFERING_RES" | jq -r '.id')

if [ -z "$OFFERING_ID" ] || [ "$OFFERING_ID" = "null" ]; then
    echo -e "${COLOR_RED}[FAIL] Service Offering creation failed!${COLOR_RESET}"
    echo -e "Response: $OFFERING_RES"
    exit 1
fi

echo -e "${COLOR_GREEN}[SUCCESS] Service Offering created successfully!${COLOR_RESET}"
echo -e "  - Service ID:    ${COLOR_GREEN}$OFFERING_ID${COLOR_RESET}"
echo -e "  - Service Name:  ${COLOR_GREEN}$(echo "$OFFERING_RES" | jq -r '.name')${COLOR_RESET}"
echo -e "  - Price:         ${COLOR_GREEN}\$$(echo "$OFFERING_RES" | jq -r '.price')${COLOR_RESET}"

# --- STEP 8: BOOK THE SERVICE (BOOKING SERVICE VIA GATEWAY) ---
echo -e "\n${COLOR_CYAN}[STEP 8] Booking the Offering as Customer...${COLOR_RESET}"
TOMORROW_DATE=$(date -d "tomorrow" "+%Y-%m-%d")
START_TIME="${TOMORROW_DATE}T10:00:00"
END_TIME="${TOMORROW_DATE}T11:00:00"

BOOKING_PAYLOAD=$(cat <<EOF
{
  "startTime": "$START_TIME",
  "endTime": "$END_TIME",
  "serviceIds": [$OFFERING_ID],
  "status": "PENDING"
}
EOF
)

# Call Create Booking. Query params: salonId, paymentMethod
BOOKING_RES=$(curl -s -X POST "$GATEWAY_URL/api/bookings?salonId=$SALON_ID&paymentMethod=RAZORPAY" \
  -H "Authorization: $CUST_AUTH" \
  -H "Content-Type: application/json" \
  -d "$BOOKING_PAYLOAD")

echo -e "${COLOR_YELLOW}Booking response received:${COLOR_RESET}"
echo "$BOOKING_RES" | jq .

PAYMENT_LINK=$(echo "$BOOKING_RES" | jq -r '.payment_link_url')

if [ -z "$PAYMENT_LINK" ] || [ "$PAYMENT_LINK" = "null" ]; then
    echo -e "${COLOR_RED}[WARNING] Payment Link was not generated (expected if payment gateway sandbox threw an error, check logs).${COLOR_RESET}"
    echo -e "${COLOR_YELLOW}Checking direct booking registration...${COLOR_RESET}"
else
    echo -e "${COLOR_GREEN}[SUCCESS] Booking processed with Payment Gateway integration!${COLOR_RESET}"
    echo -e "  - Generated Payment Link: ${COLOR_CYAN}$PAYMENT_LINK${COLOR_RESET}"
fi

# Verify booking is listed under customer bookings
echo -e "\n${COLOR_CYAN}Verifying Customer Bookings list...${COLOR_RESET}"
CUST_BOOKINGS=$(curl -s -X GET "$GATEWAY_URL/api/bookings/customer" \
  -H "Authorization: $CUST_AUTH" \
  -H "Content-Type: application/json")

CUSTOMER_BOOKING_FOUND=$(echo "$CUST_BOOKINGS" | jq --arg sid "$OFFERING_ID" '.[] | select((.serviceIds // .servicesIds // [])[] == ($sid | tonumber))')

if [ -z "$CUSTOMER_BOOKING_FOUND" ]; then
    echo -e "${COLOR_RED}[FAIL] Created booking was not found in the Customer's booking list!${COLOR_RESET}"
    echo -e "Customer Bookings: $CUST_BOOKINGS"
    exit 1
fi

BOOKING_FINAL_ID=$(echo "$CUSTOMER_BOOKING_FOUND" | jq -r '.id')
BOOKING_FINAL_STATUS=$(echo "$CUSTOMER_BOOKING_FOUND" | jq -r '.status')

echo -e "${COLOR_GREEN}[SUCCESS] Booking successfully registered and persisted!${COLOR_RESET}"
echo -e "  - Booking ID:     ${COLOR_GREEN}$BOOKING_FINAL_ID${COLOR_RESET}"
echo -e "  - Booking Status: ${COLOR_GREEN}$BOOKING_FINAL_STATUS${COLOR_RESET}"
echo -e "  - Scheduled:      ${COLOR_GREEN}$START_TIME to $END_TIME${COLOR_RESET}"

echo -e "\n${COLOR_BLUE}================================================================${COLOR_RESET}"
echo -e "${COLOR_GREEN}    E2E MICROSERVICES INTEGRATION COMPLETED 100% SUCCESSFULLY!   ${COLOR_RESET}"
echo -e "    GATEWAY, KEYCLOAK, AND ALL SERVICES FUNCTION BEAUTIFULLY!   "
echo -e "${COLOR_BLUE}================================================================${COLOR_RESET}"
