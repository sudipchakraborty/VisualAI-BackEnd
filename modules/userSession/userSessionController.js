const userSessionService =
    require("./userSessionService");

async function logout(req, res) {
    try {
        const userId =
            req.user?.userId;

        const sessionId =
            req.user?.sessionId;

        if (!userId || !sessionId) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid session information."
            });
        }

        const result =
            await userSessionService.logoutUser({
                userId,
                sessionId
            });

        return res
            .status(result.statusCode)
            .json(result);
    } catch (error) {
        console.error(
            "Logout controller error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Internal server error."
        });
    }
}

module.exports = {
    logout
};