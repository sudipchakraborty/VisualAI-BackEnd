if (require.main === module) {
    require("dotenv").config();
}

const db = require("../postgres");

async function createPasswordResetTokensTable() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id BIGSERIAL PRIMARY KEY,
            user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token_hash CHAR(64) NOT NULL UNIQUE,
            expires_at TIMESTAMPTZ NOT NULL,
            requested_ip VARCHAR(45),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            used_at TIMESTAMPTZ
        );
    `);

    await db.query(`
        CREATE INDEX IF NOT EXISTS
            password_reset_tokens_user_id_idx
        ON password_reset_tokens (user_id);
    `);
}

module.exports = createPasswordResetTokensTable;

if (require.main === module) {
    createPasswordResetTokensTable()
        .then(() => {
            console.log(
                "[DB] password_reset_tokens table is ready"
            );
        })
        .catch((error) => {
            console.error(
                "[DB] password-reset migration failed:",
                error.message
            );
            process.exitCode = 1;
        })
        .finally(() => db.close());
}
