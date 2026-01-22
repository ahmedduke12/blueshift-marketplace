import postgres from 'postgres';

console.log('🔍 Diagnosing Database State...\n');

const connectionString = 'postgresql://postgres.pfjallmztupeirisdhmf:Thuk%40ir227030@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

const sql = postgres(connectionString, {
    max: 1,
    ssl: false,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 20
});

try {
    // 1. Check Tables
    const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    `;
    console.log('📊 Tables found:', tables.length ? tables.map(t => t.table_name).join(', ') : 'None');

    // 2. Check Types/Enums
    const types = await sql`
        SELECT t.typname
        FROM pg_type t
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'public' 
        AND t.typtype = 'e';
    `;
    console.log('📝 Enums found:', types.length ? types.map(t => t.typname).join(', ') : 'None');

    // 3. Check Rows in Tables (if any)
    if (tables.length > 0) {
        console.log('\n📉 Row Counts:');
        for (const table of tables) {
            try {
                // Safe way to count, though slow for huge tables (not expected here)
                const count = await sql`SELECT count(*) FROM ${sql(table.table_name)}`;
                console.log(`   - ${table.table_name}: ${count[0].count}`);
            } catch (e) {
                console.log(`   - ${table.table_name}: Error counting (${e.message})`);
            }
        }
    }

    await sql.end();
    process.exit(0);
} catch (error) {
    console.log('❌ DIAGNOSIS FAILED\n');
    console.log(`   Error: ${error.message}`);
    await sql.end();
    process.exit(1);
}
