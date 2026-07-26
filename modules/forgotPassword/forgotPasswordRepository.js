const db = require("../../database/postgres");

async function findUserByEmail(email) {
    const rows = await db.query(
        `
        SELECT id, full_name, email, status
        FROM users
        WHERE LOWER(email) = LOWER($1)
        LIMIT 1;
        `,
        [email]
    );

    return rows[0] || null;
}

async function saveResetToken({
    userId,
    tokenHash,
    expiresAt,
    requestedIp
}) {
    const rows = await db.query(
        `
        INSERT INTO password_reset_tokens
            (user_id, token_hash, expires_at, requested_ip)
        VALUES
            ($1, $2, $3, $4)
        RETURNING id, user_id, expires_at, created_at;
        `,
        [userId, tokenHash, expiresAt, requestedIp || null]
    );

    return rows[0];
}

async function findValidToken(tokenHash) {
    const rows = await db.query(
        `
        SELECT id, user_id, expires_at
        FROM password_reset_tokens
        WHERE token_hash = $1
          AND used_at IS NULL
          AND expires_at > NOW()
        LIMIT 1;
        `,
        [tokenHash]
    );

    return rows[0] || null;
}

async function completePasswordReset({
    resetTokenId,
    userId,
    passwordHash
}) {
    const client = await db.pool.connect();

    try {
        await client.query("BEGIN");

        const tokenResult = await client.query(
            `
            UPDATE password_reset_tokens
            SET used_at = NOW()
            WHERE id = $1
              AND user_id = $2
              AND used_at IS NULL
              AND expires_at > NOW()
            RETURNING id;
            `,
            [resetTokenId, userId]
        );

        if (tokenResult.rowCount !== 1) {
            await client.query("ROLLBACK");
            return false;
        }

        await client.query(
            `
            UPDATE users
            SET password_hash = $1
            WHERE id = $2;
            `,
            [passwordHash, userId]
        );

        await client.query(
            `
            UPDATE user_sessions
            SET session_status = 'Revoked',
                logout_time = NOW()
            WHERE user_id = $1
              AND session_status = 'Active';
            `,
            [userId]
        );

        await client.query("COMMIT");
        return true;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    findUserByEmail,
    saveResetToken,
    findValidToken,
    completePasswordReset
};
