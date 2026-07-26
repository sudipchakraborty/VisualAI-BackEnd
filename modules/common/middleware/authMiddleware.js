const jwt =
    require("jsonwebtoken");

const userSessionRepository =
    require(
        "../../userSession/userSessionRepository"
    );

async function authenticateToken(
    req,
    res,
    next
) {
    try {
        const authorizationHeader =
            req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).json({
                success: false,
                message:
                    "Authorization token is required."
            });
        }

        const parts =
            authorizationHeader.split(" ");

        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer"
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid authorization format."
            });
        }

        const token =
            parts[1];

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        if (
            !decoded.userId ||
            !decoded.sessionId
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid token payload."
            });
        }

        const activeSession =
            await userSessionRepository
                .findActiveSession({
                    userId:
                        decoded.userId,
                    sessionId:
                        decoded.sessionId
                });

        if (!activeSession) {
            return res.status(401).json({
                success: false,
                message:
                    "Session has expired or was logged out."
            });
        }

        req.user =
            decoded;

        req.session =
            activeSession;

        next();
    } catch (error) {
        if (
            error.name ===
            "TokenExpiredError"
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Token has expired."
            });
        }

        return res.status(401).json({
            success: false,
            message:
                "Invalid authentication token."
        });
    }
}

module.exports =
    authenticateToken;
