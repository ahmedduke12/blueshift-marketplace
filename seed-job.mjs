import postgres from 'postgres';
import { nanoid } from 'nanoid';

console.log('🌱 Seeding Database for Verification...\n');

const connectionString = 'postgresql://postgres.pfjallmztupeirisdhmf:Thuk%40ir227030@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

const sql = postgres(connectionString, {
    max: 1,
    ssl: false,
    prepare: false
});

try {
    // 1. Create User
    const openId = `test_user_${nanoid(5)}`;
    const user = await sql`
        INSERT INTO users ("openId", name, role, "loginMethod")
        VALUES (${openId}, 'Test Owner', 'company_admin', 'email')
        RETURNING id
    `;
    const userId = user[0].id;
    console.log(`✅ User created (ID: ${userId})`);

    // 2. Create Company
    const company = await sql`
        INSERT INTO companies (name, "crNumber", "contactEmail", "createdById")
        VALUES ('Test Construction Co', ${nanoid(10)}, 'test@example.com', ${userId})
        RETURNING id
    `;
    const companyId = company[0].id;
    console.log(`✅ Company created (ID: ${companyId})`);

    // 3. Create Job
    const jobTitle = `VERIFICATION JOB ${nanoid(5)}`;
    await sql`
        INSERT INTO jobs (
            "companyId", title, description, "wageAmount", "wageType", 
            "numberOfWorkers", status, "startDate", "endDate", "postedById"
        )
        VALUES (
            ${companyId}, ${jobTitle}, 'This is a test job to verify DB connection', 
            150, 'daily', 5, 'active', NOW(), NOW() + INTERVAL '30 days', ${userId}
        )
    `;
    console.log(`✅ Job created: "${jobTitle}"`);
    console.log('\nPlease check the production site to see if this job appears!');

    await sql.end();
    process.exit(0);
} catch (error) {
    console.log('❌ SEED FAILED');
    console.log(error);
    await sql.end();
    process.exit(1);
}
