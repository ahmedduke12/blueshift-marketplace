import { defineConfig } from "drizzle-kit";

// Use separate connection parameters to avoid URL encoding issues
export default defineConfig({
    schema: "./drizzle/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        host: "db.pfjallmztupeirisdhmf.supabase.co",
        port: 5432,
        user: "postgres",
        password: "Thuk@ir227030",
        database: "postgres",
        ssl: true,
    },
});
