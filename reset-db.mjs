import postgres from 'postgres';

console.log('🧨 Resetting Database...\n');

const connectionString = 'postgresql://postgres.pfjallmztupeirisdhmf:Thuk%40ir227030@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

const sql = postgres(connectionString, {
    max: 1,
    ssl: false,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 20
});

try {
    console.log('⏳ Connecting to pooler...');

    // 1. Drop and Recreate Schema
    console.log('🗑️  Dropping public schema...');
    await sql`DROP SCHEMA IF EXISTS public CASCADE`;
    await sql`CREATE SCHEMA public`;
    await sql`GRANT ALL ON SCHEMA public TO postgres`;
    await sql`GRANT ALL ON SCHEMA public TO public`;
    console.log('✨ Schema recreated.');

    // 2. Apply Migration
    console.log('📜 Applying migration.sql...');
    await sql.file('migration.sql');

    console.log('✅ DATABASE RESET & MIGRATED SUCCESSFUL!\n');

    // 3. Verify
    const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    `;
    console.log('📊 Tables created:', tables.length);
    console.log('   List:', tables.map(t => t.table_name).join(', '));

    await sql.end();
    process.exit(0);
} catch (error) {
    console.log('❌ RESET FAILED\n');
    console.log(`   Error: ${error.message}`);

    await sql.end();
    process.exit(1);
}
