const db = require("../../database/postgres");

async function createSession({
    userId,
    ipAddress,
    userAgent
}) {
    const query = `
        INSERT INTO user_sessions
        (
            user_id,
            ip_address,
            user_agent
        )
        VALUES
        (
            $1,
            $2,
            $3
        )
        RETURNING
            id,
            user_id,
            login_time,
            logout_time,
            session_status,
            ip_address,
            user_agent
    `;

    const values = [
        userId,
        ipAddress || null,
        userAgent || null
    ];

    const rows =
        await db.query(query, values);

    return rows[0];
}

async function closeSession({
    sessionId,
    userId
}) {
    const query = `
        UPDATE user_sessions
        SET
            logout_time = CURRENT_TIMESTAMP,
            session_status = 'LoggedOut'
        WHERE id = $1
          AND user_id = $2
          AND session_status = 'Active'
        RETURNING
            id,
            user_id,
            login_time,
            logout_time,
            session_status
    `;

    const values = [
        sessionId,
        userId
    ];

    const rows =
        await db.query(query, values);

    return rows[0] || null;
}

async function findActiveSession({
    sessionId,
    userId
}) {
    const query = `
        SELECT
            id,
            user_id,
            login_time,
            logout_time,
            session_status,
            ip_address,
            user_agent
        FROM user_sessions
        WHERE id = $1
          AND user_id = $2
          AND session_status = 'Active'
        LIMIT 1
    `;

    const values = [
        sessionId,
        userId
    ];

    const rows =
        await db.query(query, values);

    return rows[0] || null;
}

module.exports = {
    createSession,
    closeSession,
    findActiveSession
};
