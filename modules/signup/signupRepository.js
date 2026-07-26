const db = require("../../database/postgres");

const TABLE_NAME = "users";

async function create(signupData) {
    return db.insert(TABLE_NAME, signupData);
}

async function findByEmail(email) {
    const rows = await db.query(
        `
        SELECT id, full_name, company, email, role, status, created_at
        FROM ${TABLE_NAME}
        WHERE email = $1
        LIMIT 1;
        `,
        [email]
    );

    return rows[0] || null;
}

module.exports = {
    create,
    findByEmail
};
