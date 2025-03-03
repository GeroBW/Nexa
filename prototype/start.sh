#!/bin/bash
# setup.sh - Nexa Project Setup Script

# Exit on error
set -e

echo "Starting Nexa Project Setup..."

# Set root directory
ROOT_DIR="$(pwd)"

# Setup Medusa backend
echo "Setting up Medusa backend..."
cd "$ROOT_DIR/medusa"

# Create .env file
echo "Creating .env file..."
cp .env.template .env

# Install dependencies
echo "Installing Medusa dependencies..."
yarn
# restoring docker volume
docker volume create medusa_dev_medusa_dev-minio-data
docker run --rm \
  -v medusa_dev_medusa_dev-minio-data:/data \
  -v $(pwd)/data_backup:/backup \
  alpine sh -c "cd /data && tar -xzf /backup/minio-data-new.tar.gz"

# Start Docker containers
echo "Starting Docker services..."
docker compose -p medusa_dev up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 10

# Restore database
echo "Restoring database from backup..."
if [ -f ./data_backup/medusa_db_backup.sql ]; then
  docker exec -i medusa_dev-postgres-1 psql -U postgres -d medusa < ./data_backup/medusa_db_backup.sql
else
  echo "Warning: Database backup file not found. Skipping restore."
fi

# Build Medusa
echo "Building Medusa..."
yarn build

# Start Medusa in background
echo "Starting Medusa server in background..."
yarn dev &
MEDUSA_PID=$!

# Wait for Medusa to start
echo "Waiting for Medusa to start..."
sleep 10

# Setup Storefront
echo "Setting up Storefront..."
cd "$ROOT_DIR/storefront"

# Create .env.local file
echo "Creating .env.local file..."
cp .env.template .env.local

# Install dependencies
echo "Installing Storefront dependencies..."
yarn

# Start Storefront
echo "Starting Storefront..."
yarn dev &
STOREFRONT_PID=$!

# Display information
echo ""
echo "Setup completed!"
echo ""
echo "Medusa admin is running at: http://localhost:9000/app"
echo "Storefront is running at: http://localhost:8000"
echo ""
# echo "IMPORTANT: You need to manually copy the publishable API key from Medusa admin"
# echo "Go to http://localhost:9000/app/settings/publishable-api-keys"
# echo "Copy the key and paste it into storefront/.env.local as NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY"
# echo ""
echo "To stop the servers, press Ctrl+C or run: kill $MEDUSA_PID $STOREFRONT_PID"

# Wait for user to terminate
wait