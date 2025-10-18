#!/bin/bash

set -e  # Exit immediately on error
echo "🚀 Starting local environment..."

# Step 1: start Docker containers
echo "🐳 Starting Docker containers..."
cd "$(dirname "$0")/../docker"
docker compose up -d

# Step 2: check if the database is ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker exec postgres17-local pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
  echo -n "."
done
echo "✅ PostgreSQL is ready."

# Step 3: return to the Prisma directory to run migrations and seed data
echo "📦 Applying Prisma migrations and seeding data..."
cd ../prisma
npm install --silent
npm run db:push
npm run seed

# Step 4: start the backend service (optional)
# echo "🚀 Starting backend service..."
# cd ../backend
# npm run dev &

echo "🎉 All services started successfully!"
