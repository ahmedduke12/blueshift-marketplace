import postgres from 'postgres';
import { config } from 'dotenv';

// Load environment variables
config();

console.log('🔍 Supabase Connection Diagnostic Tool\n');
console.log('='.repeat(60));

// Extract connection details from DATABASE_URL
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error('❌ DATABASE_URL not found in environment variables');
    console.log('\n💡 Make sure .env file exists with DATABASE_URL');
    process.exit(1);
}

console.log('✅ DATABASE_URL found in .env file\n');

// Parse the URL to show details (without password)
try {
    const url = new URL(dbUrl);
    console.log('📋 Connection Details:');
    console.log(`   Protocol: ${url.protocol}`);
    console.log(`   Host: ${url.hostname}`);
    console.log(`   Port: ${url.port || '5432'}`);
    console.log(`   Database: ${url.pathname.slice(1)}`);
    console.log(`   Username: ${url.username}`);
    console.log(`   Password: ${'*'.repeat(url.password.length)} (hidden)\n`);
} catch (err) {
    console.error('❌ Invalid DATABASE_URL format:', err.message);
    process.exit(1);
}

console.log('='.repeat(60));
console.log('\n🧪 Running Connection Tests...\n');

// Test configurations to try
const testConfigs = [
    {
        name: 'Direct Connection (Port 5432) - No SSL',
        config: {
            max: 1,
            ssl: false,
            connect_timeout: 10,
            idle_timeout: 20,
        }
    },
    {
        name: 'Direct Connection (Port 5432) - SSL Enabled',
        config: {
            max: 1,
            ssl: { rejectUnauthorized: false },
            connect_timeout: 10,
            idle_timeout: 20,
        }
    },
    {
        name: 'Direct Connection - Minimal Config',
        config: {
            max: 1,
            connect_timeout: 15,
        }
    }
];

// Run tests sequentially
async function runTests() {
    for (let i = 0; i < testConfigs.length; i++) {
        const test = testConfigs[i];
        console.log(`\n[Test ${i + 1}/${testConfigs.length}] ${test.name}`);
        console.log('-'.repeat(60));

        let sql = null;
        try {
            console.log('⏳ Attempting connection...');
            sql = postgres(dbUrl, test.config);

            console.log('⏳ Executing test query...');
            const result = await sql`SELECT version(), current_database(), current_user`;

            console.log('✅ CONNECTION SUCCESSFUL!');
            console.log('\n📊 Database Info:');
            console.log(`   PostgreSQL Version: ${result[0].version.split(' ')[1]}`);
            console.log(`   Database: ${result[0].current_database}`);
            console.log(`   User: ${result[0].current_user}`);

            await sql.end();
            console.log('\n🎉 SUCCESS! This configuration works.');
            console.log('\n💡 Use this configuration in your server/db.ts:');
            console.log(JSON.stringify(test.config, null, 2));

            return; // Exit on first success

        } catch (error) {
            console.log('❌ FAILED');
            console.log(`   Error Type: ${error.code || error.name}`);
            console.log(`   Message: ${error.message}`);

            if (error.code === 'ENOTFOUND') {
                console.log('\n💡 DNS Resolution Failed:');
                console.log('   - Check if Supabase project is active (not paused)');
                console.log('   - Verify hostname in DATABASE_URL is correct');
                console.log('   - Try disabling VPN if active');
            } else if (error.code === 'ETIMEDOUT') {
                console.log('\n💡 Connection Timeout:');
                console.log('   - Check firewall settings');
                console.log('   - Verify port is not blocked');
                console.log('   - Check if IP is whitelisted in Supabase');
            } else if (error.code === 'ECONNREFUSED') {
                console.log('\n💡 Connection Refused:');
                console.log('   - Database may be paused or inactive');
                console.log('   - Port may be incorrect');
            } else if (error.message.includes('password')) {
                console.log('\n💡 Authentication Failed:');
                console.log('   - Verify password is correct');
                console.log('   - Check if special characters are URL-encoded');
            }

            if (sql) {
                try {
                    await sql.end({ timeout: 1 });
                } catch (e) {
                    // Ignore cleanup errors
                }
            }
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('❌ All connection tests failed');
    console.log('\n📋 Next Steps:');
    console.log('1. Check Supabase Dashboard - verify project is ACTIVE');
    console.log('2. Get fresh connection string from Project Settings → Database');
    console.log('3. Verify no VPN is blocking the connection');
    console.log('4. Check Windows Firewall settings');
    console.log('5. Try the pooler connection (port 6543) instead');
    console.log('\n💡 See database_connection_troubleshooting.md for detailed steps');
}

runTests().catch(err => {
    console.error('\n💥 Unexpected error:', err);
    process.exit(1);
});
