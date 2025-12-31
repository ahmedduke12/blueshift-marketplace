// push-schema.js
// Simple script to push schema to Supabase with proper URL encoding

const { execSync } = require('child_process');

// Set the DATABASE_URL with URL-encoded password
process.env.DATABASE_URL = 'postgresql://postgres:Thuk%40ir227030@db.pfjallmztupeirisdhmf.supabase.co:5432/postgres';

console.log('Pushing schema to Supabase...');
console.log('Database:', process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@'));

try {
    execSync('npx drizzle-kit push', {
        stdio: 'inherit',
        env: process.env
    });
    console.log('\n✅ Schema pushed successfully!');
} catch (error) {
    console.error('\n❌ Failed to push schema');
    process.exit(1);
}
