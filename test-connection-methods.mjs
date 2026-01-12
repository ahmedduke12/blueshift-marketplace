import postgres from 'postgres';
import { readFileSync } from 'fs';

console.log('🔍 Testing Multiple Supabase Connection Methods...\n');

// Read DATABASE_URL from .env file
const envContent = readFileSync('.env', 'utf-8');
const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);

if (!dbUrlMatch) {
    console.error('❌ DATABASE_URL not found in .env');
    process.exit(1);
}

const DATABASE_URL = dbUrlMatch[1].trim();

// Extract components from the URL
const urlMatch = DATABASE_URL.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
if (!urlMatch) {
    console.error('❌ Could not parse DATABASE_URL');
    process.exit(1);
}

const [, user, password, host, port, database] = urlMatch;
const projectRef = host.split('.')[0].replace('db.', '');

console.log('📋 Connection Details:');
console.log(`   User: ${user}`);
console.log(`   Host: ${host}`);
console.log(`   Port: ${port}`);
console.log(`   Database: ${database}`);
console.log(`   Project Ref: ${projectRef}\n`);

// Test different connection methods
const connectionMethods = [
    {
        name: 'Direct Database Connection',
        url: DATABASE_URL,
    },
    {
        name: 'Transaction Pooler (IPv4)',
        url: `postgresql://postgres.${projectRef}:${password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
    },
    {
        name: 'Session Pooler (IPv4)',
        url: `postgresql://postgres.${projectRef}:${password}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,
    },
];

async function testConnection(method) {
    console.log(`\n🔌 Testing: ${method.name}`);
    console.log(`   URL: ${method.url.replace(password, '***')}`);

    try {
        const sql = postgres(method.url, {
            max: 1,
            idle_timeout: 5,
            connect_timeout: 10,
            ssl: 'require',
        });

        const result = await sql`SELECT version(), current_database() as db`;

        console.log(`   ✅ SUCCESS!`);
        console.log(`   PostgreSQL: ${result[0].version.split(' ')[1]}`);
        console.log(`   Database: ${result[0].db}`);

        await sql.end();
        return true;
    } catch (error) {
        console.log(`   ❌ FAILED: ${error.message}`);
        return false;
    }
}

// Test all methods
let successCount = 0;
for (const method of connectionMethods) {
    const success = await testConnection(method);
    if (success) successCount++;
}

console.log(`\n\n📊 Results: ${successCount}/${connectionMethods.length} methods succeeded`);

if (successCount === 0) {
    console.log('\n⚠️  All connection methods failed. Possible issues:');
    console.log('   1. Supabase project is paused (check dashboard)');
    console.log('   2. Password needs to be rotated');
    console.log('   3. Network/firewall blocking connections');
    console.log('   4. VPN interference');
    console.log('\n💡 Next steps:');
    console.log('   1. Visit https://supabase.com/dashboard/project/' + projectRef);
    console.log('   2. Check if project is active (not paused)');
    console.log('   3. Go to Settings > Database > Connection string');
    console.log('   4. Copy the exact connection string from there');
    process.exit(1);
} else {
    console.log('\n✨ At least one method worked! Use the successful connection string.');
    process.exit(0);
}
