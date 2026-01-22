import postgres from 'postgres';

console.log('🚀 Starting Database Migration...\n');

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
    // Simple query to verify connection first
    await sql`SELECT 1`;
    console.log('✅ Connected. Applying migration.sql...');

    // Read and execute migration file
    await sql.file('migration.sql');

    console.log('✅ MIGRATION SUCCESSFUL!\n');

    // Verify tables
    const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    `;
    console.log('📊 Tables created:', tables.map(t => t.table_name).join(', '));

    await sql.end();
    process.exit(0);
} catch (error) {
    console.log('❌ MIGRATION FAILED\n');
    console.log(`   Error: ${error.message}`);
    console.log(`   Code: ${error.code || 'N/A'}`);
    if (error.position) console.log(`   Position: ${error.position}`);

    await sql.end();
    process.exit(1);
}
