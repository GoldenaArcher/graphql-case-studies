#!/bin/bash

set -e  # 遇到错误立即中断
echo "🚀 Starting local environment..."

# Step 1: 启动 docker 容器
echo "🐳 Starting Docker containers..."
cd "$(dirname "$0")/../docker"
docker compose up -d

# Step 2: 检查数据库是否已就绪
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker exec postgres17-local pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
  echo -n "."
done
echo "✅ PostgreSQL is ready."

# Step 3: 回到 Prisma 目录，运行迁移和 seed
echo "📦 Applying Prisma migrations and seeding data..."
cd ../prisma
npm install --silent
npm run db:push
npm run seed

# Step 4: 启动 backend server（可选）
# echo "🚀 Starting backend server..."
# cd ../backend
# npm run dev &

echo "🎉 All services started successfully!"