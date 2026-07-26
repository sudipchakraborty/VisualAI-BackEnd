const test = require("node:test");
const assert = require("node:assert/strict");
const validation =
    require("./forgotPasswordValidation");

test("reset validation requires matching passwords and a secure token", () => {
    const result = validation.validateReset({
        token: "a".repeat(64),
        password: "NewTest@123",
        confirmPassword: "different"
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.includes("Passwords do not match."));
});

test("reset validation accepts the expected reset body", () => {
    const result = validation.validateReset({
        token: "a".repeat(64),
        password: "NewTest@123",
        confirmPassword: "NewTest@123"
    });

    assert.equal(result.valid, true);
});
