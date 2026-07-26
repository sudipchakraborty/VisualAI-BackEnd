function validateRequest(data = {}) {
    const email =
        typeof data.email === "string"
            ? data.email.trim().toLowerCase()
            : "";
    const errors = [];

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("A valid email address is required.");
    }

    return {
        valid: errors.length === 0,
        errors,
        data: { email }
    };
}

function validateReset(data = {}) {
    const token =
        typeof data.token === "string"
            ? data.token.trim()
            : "";
    const password =
        typeof data.password === "string"
            ? data.password
            : "";
    const confirmPassword =
        typeof data.confirmPassword === "string"
            ? data.confirmPassword
            : "";
    const errors = [];

    if (!/^[a-f0-9]{64}$/i.test(token)) {
        errors.push("A valid reset token is required.");
    }

    if (password.length < 8) {
        errors.push("Password must be at least 8 characters.");
    }

    if (password !== confirmPassword) {
        errors.push("Passwords do not match.");
    }

    return {
        valid: errors.length === 0,
        errors,
        data: { token, password }
    };
}

module.exports = {
    validateRequest,
    validateReset
};
