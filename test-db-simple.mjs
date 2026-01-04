// Minimal Supabase connection test using pg driver
import pg from 'pg';
const { Client } = pg;

const url = process.env.DATABASE_URL;

if (!url) {
    console.error('❌ DATABASE_URL is missing');
    console.log('\n📝 Set it in your .env file:');
    console.log('DATABASE_URL=postgresql://postgres:[PASSWORD]@db.pfjallmztupeirisdhmf.supabase.co:5432/postgres');
    process.exit(1);
}

console.log('🔍 Testing Supabase connection...\n');
console.log(`📏 URL length: ${url.length} characters`);
console.log(`🔗 Host: ${url.match(/@([^:]+):/)?.[1] || 'unknown'}\n`);

const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false }
});

try {
    console.log('🔌 Connecting...');
    await client.connect();

    console.log('✅ Connected successfully!\n');

    const { rows } = await client.query('SELECT version(), current_database() as db');
    console.log(`📦 PostgreSQL: ${rows[0].version.split(' ')[1]}`);
    console.log(`💾 Database: ${rows[0].db}\n`);

    // Check for tables
    const tables = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `);

    console.log(`📊 Found ${tables.rows.length} tables:`);
    if (tables.rows.length > 0) {
        tables.rows.forEach(t => console.log(`   ✓ ${t.table_name}`));
    } else {
        console.log('   ⚠️  No tables - run migrations to create schema');
    }

    console.log('\n✨ Database is ready!');

} catch (error) {
    console.error('\n❌ Connection failed!');
    console.error(`Error: ${error.message}\n`);

    if (error.message.includes('password authentication failed')) {
        console.log('🔧 Wrong password - verify your Supabase password');
        console.log('   Remember to URL-encode special characters!');
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('ECONNREFUSED')) {
        console.log('🔧 Connection timeout - check:');
        console.log('   1. Is your Supabase project active (not paused)?');
        console.log('   2. Network/VPN blocking port 5432?');
    } else if (error.message.includes('ENOTFOUND')) {
        console.log('🔧 DNS resolution failed - verify hostname');
    }

    process.exit(1);

} finally {
    await client.end().catch(() => { });
}
