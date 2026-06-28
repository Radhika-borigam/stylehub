#!/bin/bash

# Advanced Test Script for StyleHub User Service
# Tests SignUp, DB Sync, Login, Refresh Token, and Fetch User by ID

BASE_URL="http://localhost:5001"
COLOR_RESET="\033[0m"
COLOR_GREEN="\033[32m"
COLOR_RED="\033[31m"
COLOR_BLUE="\033[34m"
COLOR_YELLOW="\033[33m"
COLOR_CYAN="\033[36m"

# Generate unique details for this test run
RAND_ID=$((1000 + RANDOM % 9000))
USERNAME="testuser_$RAND_ID"
EMAIL="testuser_${RAND_ID}@example.com"
PASSWORD="SecurePassword123!"
FULL_NAME="Automated Tester $RAND_ID"
PHONE="987654$RAND_ID"
ROLE="CUSTOMER"

echo -e "${COLOR_BLUE}================================================================${COLOR_RESET}"
echo -e "${COLOR_BLUE}    STYLEHUB USER SERVICE INTEGRATION TEST SUITE - ADVANCED     ${COLOR_RESET}"
echo -e "${COLOR_BLUE}================================================================${COLOR_RESET}"
echo -e "${COLOR_CYAN}Testing details generated:${COLOR_RESET}"
echo -e "  - Username:  ${COLOR_YELLOW}$USERNAME${COLOR_RESET}"
echo -e "  - Email:     ${COLOR_YELLOW}$EMAIL${COLOR_RESET}"
echo -e "  - Full Name: ${COLOR_YELLOW}$FULL_NAME${COLOR_RESET}"
echo -e "  - Role:      ${COLOR_YELLOW}$ROLE${COLOR_RESET}"
echo -e "----------------------------------------------------------------"

# Check if user-service is running
if ! curl -s -f "$BASE_URL/api/users" > /dev/null; then
    echo -e "${COLOR_RED}[ERROR] User Service is not running at $BASE_URL.${COLOR_RESET}"
    echo -e "Please make sure the server is started."
    exit 1
fi
echo -e "${COLOR_GREEN}[SUCCESS] Connected to User Service at $BASE_URL!${COLOR_RESET}"

# 1. SIGNUP TEST
echo -e "\n${COLOR_CYAN}[STEP 1] Testing User Registration (SignUp)...${COLOR_RESET}"
SIGNUP_PAYLOAD=$(cat <<EOF
{
  "email": "$EMAIL",
  "password": "$PASSWORD",
  "phone": "$PHONE",
  "fullName": "$FULL_NAME",
  "username": "$USERNAME",
  "role": "$ROLE"
}
EOF
)

SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "$SIGNUP_PAYLOAD")

SUCCESS_STATUS=$(echo "$SIGNUP_RESPONSE" | jq -r '.success')

if [ "$SUCCESS_STATUS" != "true" ]; then
    echo -e "${COLOR_RED}[FAIL] SignUp failed!${COLOR_RESET}"
    echo -e "Response: $SIGNUP_RESPONSE"
    exit 1
fi

echo -e "${COLOR_GREEN}[SUCCESS] SignUp succeeded!${COLOR_RESET}"
SIGNUP_JWT=$(echo "$SIGNUP_RESPONSE" | jq -r '.data.jwt')
SIGNUP_REFRESH=$(echo "$SIGNUP_RESPONSE" | jq -r '.data.refresh_token')

echo -e "  - JWT Token (first 30 chars): ${COLOR_GREEN}${SIGNUP_JWT:0:30}...${COLOR_RESET}"
echo -e "  - Refresh Token (first 30 chars): ${COLOR_GREEN}${SIGNUP_REFRESH:0:30}...${COLOR_RESET}"

# 2. DB SYNC / LIST ALL USERS TEST
echo -e "\n${COLOR_CYAN}[STEP 2] Verifying user persistence in MySQL database...${COLOR_RESET}"
USERS_LIST=$(curl -s -X GET "$BASE_URL/api/users" \
  -H "Content-Type: application/json")

USER_FOUND=$(echo "$USERS_LIST" | jq --arg email "$EMAIL" '.[] | select(.email == $email)')

if [ -z "$USER_FOUND" ]; then
    echo -e "${COLOR_RED}[FAIL] User was not found in MySQL database users list!${COLOR_RESET}"
    echo -e "Response: $USERS_LIST"
    exit 1
fi

USER_ID=$(echo "$USER_FOUND" | jq -r '.id')
echo -e "${COLOR_GREEN}[SUCCESS] User successfully persisted in database!${COLOR_RESET}"
echo -e "  - Assigned MySQL ID: ${COLOR_GREEN}$USER_ID${COLOR_RESET}"

# 3. LOGIN TEST
echo -e "\n${COLOR_CYAN}[STEP 3] Testing User Login (Authentication)...${COLOR_RESET}"
LOGIN_PAYLOAD=$(cat <<EOF
{
  "email": "$EMAIL",
  "password": "$PASSWORD"
}
EOF
)

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "$LOGIN_PAYLOAD")

LOGIN_SUCCESS=$(echo "$LOGIN_RESPONSE" | jq -r '.success')

if [ "$LOGIN_SUCCESS" != "true" ]; then
    echo -e "${COLOR_RED}[FAIL] Login failed!${COLOR_RESET}"
    echo -e "Response: $LOGIN_RESPONSE"
    exit 1
fi

echo -e "${COLOR_GREEN}[SUCCESS] Login succeeded!${COLOR_RESET}"
LOGIN_JWT=$(echo "$LOGIN_RESPONSE" | jq -r '.data.jwt')
LOGIN_REFRESH=$(echo "$LOGIN_RESPONSE" | jq -r '.data.refresh_token')

echo -e "  - New JWT Token (first 30 chars): ${COLOR_GREEN}${LOGIN_JWT:0:30}...${COLOR_RESET}"
echo -e "  - New Refresh Token (first 30 chars): ${COLOR_GREEN}${LOGIN_REFRESH:0:30}...${COLOR_RESET}"

# 4. REFRESH TOKEN TEST
echo -e "\n${COLOR_CYAN}[STEP 4] Testing Access Token Refresh...${COLOR_RESET}"
REFRESH_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/access-token/refresh-token/$LOGIN_REFRESH" \
  -H "Content-Type: application/json")

REFRESH_SUCCESS=$(echo "$REFRESH_RESPONSE" | jq -r '.success')

if [ "$REFRESH_SUCCESS" != "true" ]; then
    echo -e "${COLOR_RED}[FAIL] Token refresh failed!${COLOR_RESET}"
    echo -e "Response: $REFRESH_RESPONSE"
    exit 1
fi

echo -e "${COLOR_GREEN}[SUCCESS] Access Token successfully refreshed!${COLOR_RESET}"
REFRESHED_JWT=$(echo "$REFRESH_RESPONSE" | jq -r '.data.jwt')
echo -e "  - Refreshed JWT (first 30 chars): ${COLOR_GREEN}${REFRESHED_JWT:0:30}...${COLOR_RESET}"

# 5. FETCH USER BY ID TEST
echo -e "\n${COLOR_CYAN}[STEP 5] Testing Fetching User by MySQL ID ($USER_ID)...${COLOR_RESET}"
GET_USER_RESPONSE=$(curl -s -X GET "$BASE_URL/api/users/$USER_ID" \
  -H "Content-Type: application/json")

FETCHED_EMAIL=$(echo "$GET_USER_RESPONSE" | jq -r '.email')

if [ "$FETCHED_EMAIL" != "$EMAIL" ]; then
    echo -e "${COLOR_RED}[FAIL] Fetch user by ID failed or returned incorrect data!${COLOR_RESET}"
    echo -e "Response: $GET_USER_RESPONSE"
    exit 1
fi

echo -e "${COLOR_GREEN}[SUCCESS] Successfully retrieved correct user details from database!${COLOR_RESET}"
echo -e "  - Fetched Full Name: ${COLOR_GREEN}$(echo "$GET_USER_RESPONSE" | jq -r '.fullName')${COLOR_RESET}"
echo -e "  - Fetched Email:     ${COLOR_GREEN}$FETCHED_EMAIL${COLOR_RESET}"
echo -e "  - Fetched Username:  ${COLOR_GREEN}$(echo "$GET_USER_RESPONSE" | jq -r '.username')${COLOR_RESET}"
echo -e "  - Fetched Role:      ${COLOR_GREEN}$(echo "$GET_USER_RESPONSE" | jq -r '.role')${COLOR_RESET}"

echo -e "\n${COLOR_BLUE}================================================================${COLOR_RESET}"
echo -e "${COLOR_GREEN}    ALL TESTS COMPLETED SUCCESSFULLY! USER SERVICE IS FULLY OK  ${COLOR_RESET}"
echo -e "${COLOR_BLUE}================================================================${COLOR_RESET}"
