// Reuse the application's PostgreSQL wrapper.
const db = require("../../database/postgres");

async function findUserByEmail(email) {
    const query = `
        SELECT
            id,
            full_name,
            company,
            email,
            password_hash,
            role,
            status,
            created_at
        FROM users
        WHERE LOWER(email) = LOWER($1)
        LIMIT 1
    `;

    const values = [email];

    const rows = await db.query(
        query,
        values
    );

    return rows[0] || null;
}

module.exports = {
    findUserByEmail
};
