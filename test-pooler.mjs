import postgres from 'postgres';

console.log('🔍 Testing Pooler Connection...\n');

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
    const result = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    `;
    console.log('📊 Tables found:', result.map(r => r.table_name));

    try {
        const jobs = await sql`SELECT * FROM jobs`;
        console.log(`📋 Jobs count: ${jobs.length}`);
        if (jobs.length > 0) console.log('First job:', jobs[0].title);
    } catch (e) {
        console.log('⚠️ Could not query jobs table (might not exist yet):', e.message);
    }


    console.log('✅ CONNECTION SUCCESSFUL!\n');
    console.log('📊 Database Info:');
    console.log(`   PostgreSQL Version: ${result[0].version.split(' ')[1]}`);
    console.log(`   Database: ${result[0].current_database}`);
    console.log(`   User: ${result[0].current_user}`);
    console.log('\n🎉 Pooler connection is working!');

    await sql.end();
    process.exit(0);
} catch (error) {
    console.log('❌ CONNECTION FAILED\n');
    console.log(`   Error: ${error.message}`);
    console.log(`   Code: ${error.code || 'N/A'}`);

    if (error.code === 'ENOTFOUND') {
        console.log('\n💡 DNS resolution failed - check hostname');
    } else if (error.code === 'ETIMEDOUT') {
        console.log('\n💡 Connection timeout - check firewall/network');
    } else if (error.message.includes('password')) {
        console.log('\n💡 Authentication failed - check password');
    }

    await sql.end();
    process.exit(1);
}
