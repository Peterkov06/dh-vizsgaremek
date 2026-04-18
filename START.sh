#!/bin/bash
echo "Starting the app..."
docker compose up --build
echo "App is running at http://localhost:3000"
read -p "Press enter to continue..."