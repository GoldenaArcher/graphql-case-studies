import posts from './data/posts.json';
import prisma from '../../src/db';

export default async function seedPost() {
    console.log('🌱 Start seeding posts...');

    const existingIds = await prisma.post.findMany({
        where: { id: { in: posts.map(p => p.id) } },
        select: { id: true },
    });

    const existingIdSet = new Set(existingIds.map(p => p.id));

    const newPosts = posts.filter(p => !existingIdSet.has(p.id));

    if (newPosts.length === 0) {
        console.log('✅ No new posts to insert.');
        return;
    }

    const result = await prisma.post.createMany({
        data: newPosts,
        skipDuplicates: true,
    });

    console.log(`✅ Inserted ${result.count} new posts`);
    await prisma.$disconnect();
    console.log('🌱 Done seeding posts.\n');
}