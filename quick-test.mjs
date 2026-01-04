import postgres from 'postgres';
import { readFileSync } from 'fs';

console.log('🔍 Testing Supabase Connection...\n');

// Read DATABASE_URL from .env file
const envContent = readFileSync('.env', 'utf-8');
const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);

if (!dbUrlMatch) {
    console.error('❌ DATABASE_URL not found in .env');
    process.exit(1);
}

const DATABASE_URL = dbUrlMatch[1].trim();

console.log('✅ DATABASE_URL found');
console.log(`📏 Length: ${DATABASE_URL.length} characters`);
console.log(`🔗 Host: ${DATABASE_URL.match(/@([^:]+):/)?.[1]}\n`);

try {
    console.log('🔌 Connecting to database...');

    const sql = postgres(DATABASE_URL, {
        max: 1,
        idle_timeout: 5,
        connect_timeout: 10,
    });

    const result = await sql`SELECT version(), current_database() as db`;

    console.log('✅ CONNECTION SUCCESSFUL!\n');
    console.log(`📦 PostgreSQL: ${result[0].version.split(' ')[1]}`);
    console.log(`💾 Database: ${result[0].db}\n`);

    // Check tables
    const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `;

    console.log(`📊 Found ${tables.length} tables:`);
    if (tables.length > 0) {
        tables.forEach(t => console.log(`   ✓ ${t.table_name}`));
    } else {
        console.log('   ⚠️  No tables - run migrations');
    }

    await sql.end();
    console.log('\n✨ Database is ready to use!');
    process.exit(0);

} catch (error) {
    console.error('\n❌ Connection failed!');
    console.error(`Error: ${error.message}\n`);

    if (error.message.includes('password authentication failed')) {
        console.log('🔧 Password incorrect - verify in Supabase dashboard');
    } else if (error.message.includes('ENOTFOUND')) {
        console.log('🔧 DNS failed - check hostname');
    } else if (error.message.includes('ETIMEDOUT')) {
        console.log('🔧 Timeout - is project active?');
    }

    process.exit(1);
}
