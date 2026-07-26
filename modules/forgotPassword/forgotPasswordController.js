const forgotPasswordValidation =
    require("./forgotPasswordValidation");
const forgotPasswordService =
    require("./forgotPasswordService");

async function requestReset(req, res) {
    try {
        const validation =
            forgotPasswordValidation.validateRequest(
                req.body
            );

        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message:
                    "Forgot-password validation failed.",
                errors: validation.errors
            });
        }

        const result =
            await forgotPasswordService.requestPasswordReset({
                ...validation.data,
                ipAddress:
                    req.ip ||
                    req.socket?.remoteAddress ||
                    null
            });

        const response = {
            success: result.success,
            message: result.message
        };

        // Explicit opt-in for local Postman/frontend development only.
        if (
            process.env.NODE_ENV !== "production" &&
            process.env.PASSWORD_RESET_RETURN_LINK === "true" &&
            result.delivery
        ) {
            response.data = {
                resetLink: result.delivery.resetLink,
                expiresAt: result.delivery.expiresAt
            };
        }

        return res
            .status(result.statusCode)
            .json(response);
    } catch (error) {
        console.error(
            "Forgot-password request error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

async function resetPassword(req, res) {
    try {
        const validation =
            forgotPasswordValidation.validateReset(
                req.body
            );

        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message:
                    "Password-reset validation failed.",
                errors: validation.errors
            });
        }

        const result =
            await forgotPasswordService.resetPassword(
                validation.data
            );

        return res
            .status(result.statusCode)
            .json({
                success: result.success,
                message: result.message
            });
    } catch (error) {
        console.error(
            "Password-reset error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

module.exports = {
    requestReset,
    resetPassword
};
