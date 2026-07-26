const signupService = require("./signupService");
const signupValidation = require("./signupValidation");

exports.signup = async (req, res) => {

    try {

        const payload = req.body && Object.keys(req.body).length > 0 ? req.body : req.query;

        console.log("Signup request received:", {
            contentType: req.headers["content-type"],
            email: payload.email
        });

        const validation = signupValidation.validateSignup(payload);

        if (!validation.valid) {

            return res.status(400).json({

                success: false,
                errors: validation.errors

            });

        }

        const result = await signupService.signup(payload);

        res.status(201).json(result);

    }
    catch (error) {

        console.error("Signup failed:", error.message);

        res.status(error.statusCode || 500).json({

            success: false,
            message: error.message

        });

    }

};
