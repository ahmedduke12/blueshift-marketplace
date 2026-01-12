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
    const result = await sql`SELECT version(), current_database(), current_user`;

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
