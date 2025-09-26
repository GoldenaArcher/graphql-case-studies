import prisma from "../../src/prisma";
import users from "./data/users.json";

async function main() {
  await prisma.user.createMany({
    data: users
  });
}

main()
  .then(() => {
    console.log('✅ Users seeded');
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });