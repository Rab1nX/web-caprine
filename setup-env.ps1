# Copy server .env file
Copy-Item -Path "./server/.env.example" -Destination "./server/.env"

# Copy client .env file
Copy-Item -Path "./client/.env.example" -Destination "./client/.env"

Write-Host "Environment files have been created. Please update them with your configuration."
