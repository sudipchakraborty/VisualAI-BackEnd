const crypto = require("crypto");
const bcrypt = require("bcrypt");
const forgotPasswordRepository =
    require("./forgotPasswordRepository");

const GENERIC_REQUEST_MESSAGE =
    "If an active account exists for that email, a password reset link has been created.";

function hashResetToken(token) {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
}

function expirationMinutes() {
    const configured = Number(
        process.env.PASSWORD_RESET_EXPIRES_MINUTES
    );

    return Number.isFinite(configured) && configured > 0
        ? configured
        : 15;
}

async function requestPasswordReset(data) {
    const user =
        await forgotPasswordRepository.findUserByEmail(
            data.email
        );

    if (
        !user ||
        String(user.status).toLowerCase() !== "active"
    ) {
        return {
            success: true,
            statusCode: 200,
            message: GENERIC_REQUEST_MESSAGE
        };
    }

    const token =
        crypto.randomBytes(32).toString("hex");

    const tokenHash =
        hashResetToken(token);

    const expiresAt =
        new Date(
            Date.now() +
            expirationMinutes() * 60 * 1000
        );

    await forgotPasswordRepository.saveResetToken({
        userId: user.id,
        tokenHash,
        expiresAt,
        requestedIp: data.ipAddress
    });

    const frontendUrl =
        process.env.FRONTEND_URL ||
        "http://localhost:5173";

    const resetLink =
        `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

    return {
        success: true,
        statusCode: 200,
        message: GENERIC_REQUEST_MESSAGE,

        // This value is for an email delivery adapter. It is never stored.
        delivery: {
            email: user.email,
            fullName: user.full_name,
            resetLink,
            expiresAt
        }
    };
}

async function resetPassword(data) {
    const tokenHash =
        hashResetToken(data.token);

    const resetToken =
        await forgotPasswordRepository.findValidToken(
            tokenHash
        );

    if (!resetToken) {
        return {
            success: false,
            statusCode: 400,
            message:
                "Password reset token is invalid, expired, or already used."
        };
    }

    const passwordHash =
        await bcrypt.hash(data.password, 12);

    const completed =
        await forgotPasswordRepository.completePasswordReset({
            resetTokenId: resetToken.id,
            userId: resetToken.user_id,
            passwordHash
        });

    if (!completed) {
        return {
            success: false,
            statusCode: 400,
            message:
                "Password reset token is invalid, expired, or already used."
        };
    }

    return {
        success: true,
        statusCode: 200,
        message:
            "Password reset successfully. Please sign in with your new password."
    };
}

module.exports = {
    requestPasswordReset,
    resetPassword,
    hashResetToken
};
