import users from './data/users.json';
import { PrismaClient } from '../../generated/prisma/client';
import { hashPassword } from '../../src/utils/auth';

const prisma = new PrismaClient();

export default async function seedUser() {
  console.log('🌱 Start seeding users...');

  const existingUsers = await prisma.user.findMany({
    where: {
      id: { in: users.map(u => u.id) }
    },
    select: { id: true }
  });

  const existingIds = new Set(existingUsers.map(u => u.id));
  const newUsers = await Promise.all(users.filter(u => !existingIds.has(u.id)).map(async (u) => ({
    ...u,
    password: await hashPassword(u.password)
  })));

  if (newUsers.length === 0) {
    console.log('✅ No new users to insert.');
    await prisma.$disconnect();
    return;
  }

  const result = await prisma.user.createMany({
    data: newUsers,
    skipDuplicates: true,
  });

  console.log(`✅ Inserted ${result.count} new users`);
  await prisma.$disconnect();
  console.log('🌱 Done seeding users.\n');
}