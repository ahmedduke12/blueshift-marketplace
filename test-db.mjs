import { readFileSync } from 'fs';
import postgres from 'postgres';

console.log('🔍 Checking DATABASE_URL configuration...\n');

// Read .env file directly
try {
    const envContent = readFileSync('.env', 'utf-8');
    const lines = envContent.split('\n');

    let databaseUrl = null;
    for (const line of lines) {
        if (line.trim().startsWith('DATABASE_URL=')) {
            databaseUrl = line.split('=')[1].trim();
            break;
        }
    }

    if (!databaseUrl) {
        console.error('❌ DATABASE_URL not found in .env file');
        console.log('\n📝 Please add to .env:');
        console.log('DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT].supabase.co:5432/postgres');
        process.exit(1);
    }

    console.log('✅ Found DATABASE_URL in .env file');
    console.log(`📏 Length: ${databaseUrl.length} characters`);
    console.log(`🔗 Format: ${databaseUrl.substring(0, 20)}...${databaseUrl.substring(databaseUrl.length - 20)}`);

    // Check format
    if (!databaseUrl.includes('supabase.co')) {
        console.warn('⚠️  Warning: URL doesn\'t contain "supabase.co" - is this correct?');
    }

    if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
        console.error('❌ URL must start with postgresql:// or postgres://');
        process.exit(1);
    }

    console.log('\n🔌 Testing connection...');

    const sql = postgres(databaseUrl, {
        max: 1,
        idle_timeout: 5,
        connect_timeout: 10,
    });

    const result = await sql`SELECT version(), current_database()`;

    console.log('✅ Connection successful!');
    console.log(`📦 PostgreSQL: ${result[0].version.split(' ')[1]}`);
    console.log(`💾 Database: ${result[0].current_database}`);

    // Check tables
    const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `;

    console.log(`\n📊 Found ${tables.length} tables:`);
    if (tables.length > 0) {
        tables.forEach(t => console.log(`   ✓ ${t.table_name}`));
    } else {
        console.log('   ⚠️  No tables found - you may need to run migrations');
    }

    await sql.end();
    console.log('\n✨ Database is ready!');

} catch (error) {
    console.error('\n❌ Error:', error.message);

    if (error.message.includes('ENOTFOUND')) {
        console.log('\n🔧 DNS resolution failed - check your connection string host');
    } else if (error.message.includes('password authentication failed')) {
        console.log('\n🔧 Password is incorrect - verify your Supabase password');
        console.log('   Remember to URL-encode special characters!');
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('ECONNREFUSED')) {
        console.log('\n🔧 Connection timeout - check:');
        console.log('   1. Is your Supabase project active?');
        console.log('   2. Is your IP allowed? (Supabase → Settings → Database → Connection Pooling)');
    }

    process.exit(1);
}
