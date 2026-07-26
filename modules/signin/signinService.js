const jwt = require("jsonwebtoken");
const { verifyPassword } =
    require("../../core/password");

const signinRepository =
    require("./signinRepository");
const userSessionService =
    require(
        "../userSession/userSessionService"
    );

async function signin(data) {
    const user =
        await signinRepository.findUserByEmail(
            data.email
        );

    if (!user) {
        return {
            success: false,
            statusCode: 401,
            message:
                "Invalid email or password."
        };
    }

    const passwordMatched =
        await verifyPassword(
            data.password,
            user.password_hash
        );

    if (!passwordMatched) {
        return {
            success: false,
            statusCode: 401,
            message:
                "Invalid email or password."
        };
    }

    if (
        String(user.status).toLowerCase() !==
        "active"
    ) {
        return {
            success: false,
            statusCode: 403,
            message:
                "Your account is inactive. Please contact the administrator."
        };
    }

    if (!process.env.JWT_SECRET) {
        throw new Error(
            "JWT_SECRET is not configured."
        );
    }

    const session =
        await userSessionService.createUserSession({
            userId: user.id,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent
        });

    const token = jwt.sign(
        {
            userId: user.id,
            sessionId: session.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:
                process.env.JWT_EXPIRES_IN ||
                "8h"
        }
    );

    return {
        success: true,
        statusCode: 200,
        message: "Signin successful.",
        data: {
            token,
            session: {
                id: session.id,
                loginTime: session.login_time,
                status:
                    session.session_status
            },
            user: {
                id: user.id,
                fullName: user.full_name,
                company: user.company,
                email: user.email,
                role: user.role,
                status: user.status
            }
        }
    };
}

module.exports = {
    signin
};
