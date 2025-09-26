import seedComment from './seedComment';
import seedPost from './seedPost';
import seedUser from './seedUser';


const seedMap: Record<string, () => Promise<void>> = {
    user: seedUser,
    post: seedPost,
    comment: seedComment
};

const rawArg = process.argv[2] || 'all';

const args = rawArg === 'all'
    ? Object.keys(seedMap)
    : rawArg.split(',').map(arg => arg.trim()).filter(Boolean);

(async () => {
    for (const key of args) {
        const seeder = seedMap[key];
        if (!seeder) {
            console.warn(`⚠️ No seeder found for "${key}"`);
            continue;
        }
        console.log(`🚀 Seeding "${key}"...`);
        await seeder();
        console.log(`✅ "${key}" seeding done`);
    }
})();