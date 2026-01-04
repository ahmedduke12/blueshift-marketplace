import postgres from 'postgres';
import { config } from 'dotenv';

// Load environment variables
config();

async function testConnection() {
    console.log('🔍 Testing Supabase Connection...\n');

    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL not found in environment variables');
        console.log('\n📝 To fix this:');
        console.log('1. Create a .env file in the project root');
        console.log('2. Add: DATABASE_URL=your_supabase_connection_string');
        console.log('3. Make sure to URL-encode special characters in the password');
        console.log('   Example: @ becomes %40, ! becomes %21, etc.');
        process.exit(1);
    }

    console.log('✅ DATABASE_URL found');
    console.log(`📍 Connection string: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}\n`);

    try {
        // Create connection
        console.log('🔌 Attempting to connect...');
        const sql = postgres(process.env.DATABASE_URL, {
            max: 1, // Only one connection for testing
            idle_timeout: 5,
            connect_timeout: 10,
        });

        // Test query
        console.log('📊 Running test query...');
        const result = await sql`SELECT version()`;

        console.log('✅ Connection successful!');
        console.log(`📦 PostgreSQL version: ${result[0].version}\n`);

        // Check for tables
        console.log('🔍 Checking for tables...');
        const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;

        if (tables.length === 0) {
            console.log('⚠️  No tables found in database');
            console.log('📝 You may need to run migrations:');
            console.log('   1. Check migration.sql file');
            console.log('   2. Run it in Supabase SQL Editor');
        } else {
            console.log(`✅ Found ${tables.length} tables:`);
            tables.forEach(t => console.log(`   - ${t.table_name}`));
        }

        // Close connection
        await sql.end();

        console.log('\n✨ All tests passed! Your database is ready to use.');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Connection failed!');
        console.error('Error:', error.message);

        console.log('\n🔧 Troubleshooting steps:');
        console.log('1. Verify your Supabase project is active');
        console.log('2. Check the connection string format:');
        console.log('   postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres');
        console.log('3. Make sure the password is URL-encoded');
        console.log('4. Verify your IP is allowed in Supabase (check Connection Pooling settings)');

        process.exit(1);
    }
}

testConnection();
