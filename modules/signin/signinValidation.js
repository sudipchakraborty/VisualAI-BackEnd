function validateSignin(data) {
    const errors = [];

    const email =
        typeof data?.email === "string"
            ? data.email.trim().toLowerCase()
            : "";

    const password =
        typeof data?.password === "string"
            ? data.password
            : "";

    if (!email) {
        errors.push("Email is required.");
    } else {
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            errors.push("Please enter a valid email address.");
        }
    }

    if (!password) {
        errors.push("Password is required.");
    }

    return {
        valid: errors.length === 0,
        errors,
        data: {
            email,
            password
        }
    };
}

module.exports = {
    validateSignin
};