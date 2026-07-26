if (require.main === module) {
    require("dotenv").config();
}

const db = require("../postgres");

async function createUsersTable() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id BIGSERIAL PRIMARY KEY,
            full_name VARCHAR(100) NOT NULL,
            company VARCHAR(100),
            email VARCHAR(320) NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            role VARCHAR(50) NOT NULL DEFAULT 'User',
            status VARCHAR(20) NOT NULL DEFAULT 'Active',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `);
}

module.exports = createUsersTable;

if (require.main === module) {
    createUsersTable()
        .then(() => console.log("[DB] users table is ready"))
        .catch((error) => {
            console.error("[DB] users migration failed:", error.message);
            process.exitCode = 1;
        })
        .finally(() => db.close());
}
