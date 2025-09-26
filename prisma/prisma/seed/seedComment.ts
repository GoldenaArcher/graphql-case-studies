import comments from './data/comments.json';
import { PrismaClient } from '../../generated/prisma/client';

const prisma = new PrismaClient();

export default async function seedComment() {
    console.log('🌱 Start seeding comments...');

    const existingComments = await prisma.comment.findMany({
        where: {
            id: { in: comments.map(c => c.id) }
        },
        select: { id: true }
    });

    const existingIds = new Set(existingComments.map(c => c.id));
    const newComments = comments.filter(c => !existingIds.has(c.id));

    if (newComments.length === 0) {
        console.log('✅ No new comments to insert.');
        await prisma.$disconnect();
        return;
    }

    const result = await prisma.comment.createMany({
        data: newComments,
        skipDuplicates: true,
    });

    console.log(`✅ Inserted ${result.count} new comments`);
    await prisma.$disconnect();
    console.log('🌱 Done seeding comments.\n');
}