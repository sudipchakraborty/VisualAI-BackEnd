const signinValidation =
    require("./signinValidation");

const signinService =
    require("./signinService");

exports.signin = async (req, res) => {
    try {
        const validation =
            signinValidation.validateSignin(
                req.body
            );

        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message:
                    "Signin validation failed.",
                errors: validation.errors
            });
        }

        const result =
            await signinService.signin({
                ...validation.data,

                ipAddress:
                    req.ip ||
                    req.socket?.remoteAddress ||
                    null,

                userAgent:
                    req.headers["user-agent"] ||
                    null
            });

        return res
            .status(result.statusCode)
            .json({
                success: result.success,
                message: result.message,
                ...(result.data && {
                    data: result.data
                })
            });
    } catch (error) {
        console.error(
            "Signin Controller Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Internal server error."
        });
    }
};

exports.profile = async (req, res) => {
    return res.status(200).json({
        success: true,
        message:
            "Protected route accessed successfully.",
        user: req.user
    });
};
