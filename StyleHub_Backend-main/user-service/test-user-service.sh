#!/bin/bash

BASE_URL="http://localhost:5001/api/users"

echo "========================================"
echo "1. Get all users"
echo "========================================"

curl -X GET "$BASE_URL" \
-H "Content-Type: application/json"

echo -e "\n\n"

echo "========================================"
echo "2. Get user by id = 1"
echo "========================================"

curl -X GET "$BASE_URL/1" \
-H "Content-Type: application/json"

echo -e "\n\n"

echo "========================================"
echo "3. Get user by id = 999"
echo "========================================"

curl -X GET "$BASE_URL/999" \
-H "Content-Type: application/json"

echo -e "\n"