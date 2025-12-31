import postgres from 'postgres';

const sql = postgres('postgresql://postgres:Thuk%40ir227030@db.pfjallmztupeirisdhmf.supabase.co:5432/postgres', {
    ssl: 'require'
});

console.log('Testing connection to Supabase...');

try {
    const result = await sql`SELECT version()`;
    console.log('✅ Connection successful!');
    console.log('PostgreSQL version:', result[0].version);
    await sql.end();
    process.exit(0);
} catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
}
