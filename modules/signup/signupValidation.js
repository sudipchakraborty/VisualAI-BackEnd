function validateSignup(data = {}) {
    const payload = data && typeof data === "object" ? data : {};
    const errors = [];

    const fullName = String(
        payload.name ??
        payload.fullName ??
        payload.full_name ??
        [payload.firstName ?? payload.first_name, payload.lastName ?? payload.last_name]
            .filter(Boolean)
            .join(" ")
    ).trim();
    const email = String(payload.email ?? "").trim();
    const password = String(payload.password ?? "");

    if (fullName === "") {
        errors.push("Full Name is required.");
    }

    if (email === "") {
        errors.push("Email is required.");
    }

    if (password === "") {
        errors.push("Password is required.");
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = {
    validateSignup
};
