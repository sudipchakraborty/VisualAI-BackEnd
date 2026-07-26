const signupRepository = require("./signupRepository");
const { hashPassword } = require("../../core/password");

async function signup(data) {
    const fullName = String(
        data.name ??
        data.fullName ??
        data.full_name ??
        [data.firstName ?? data.first_name, data.lastName ?? data.last_name]
            .filter(Boolean)
            .join(" ")
    ).trim();
    const email = String(data.email).trim().toLowerCase();

    const existingSignup = await signupRepository.findByEmail(email);

    if (existingSignup) {
        const error = new Error("An account with this email already exists.");
        error.statusCode = 409;
        throw error;
    }

    const signupData = {
        full_name: fullName,
        company: String(data.company ?? "").trim() || null,
        email,
        password_hash: await hashPassword(String(data.password)),
        role: "User",
        status: "Active"
    };

    let savedSignup;

    try {
        savedSignup = await signupRepository.create(signupData);
    } catch (error) {
        // Protect against two simultaneous requests passing the lookup above.
        if (error.code === "23505") {
            const conflictError = new Error("An account with this email already exists.");
            conflictError.statusCode = 409;
            throw conflictError;
        }

        throw error;
    }

    return {
        success: true,
        message: "Signup saved successfully.",
        data: {
            id: savedSignup.id,
            name: savedSignup.full_name,
            company: savedSignup.company,
            email: savedSignup.email,
            role: savedSignup.role,
            status: savedSignup.status,
            createdAt: savedSignup.created_at
        }
    };
}

module.exports = {
    signup,
    hashPassword
};
