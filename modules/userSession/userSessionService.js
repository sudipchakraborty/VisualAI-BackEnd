const userSessionRepository =
    require("./userSessionRepository");

async function createUserSession({
    userId,
    ipAddress,
    userAgent
}) {
    return userSessionRepository.createSession({
        userId,
        ipAddress,
        userAgent
    });
}

async function logoutUser({
    sessionId,
    userId
}) {
    const session =
        await userSessionRepository.closeSession({
            sessionId,
            userId
        });

    if (!session) {
        return {
            success: false,
            statusCode: 404,
            message:
                "Active session was not found."
        };
    }

    return {
        success: true,
        statusCode: 200,
        message:
            "Logout completed successfully.",
        data: session
    };
}

module.exports = {
    createUserSession,
    logoutUser
};