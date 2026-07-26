const test = require("node:test");
const assert = require("node:assert/strict");
const signinRepository = require("./signinRepository");
const signinService = require("./signinService");
const { hashPassword } = require("../../core/password");
const userSessionService = require("../userSession/userSessionService");
const jwt = require("jsonwebtoken");

async function activeUser() {
    return {
        id: 7,
        full_name: "Jane Doe",
        company: "Example Ltd",
        email: "jane@example.com",
        password_hash: await hashPassword("correct-password"),
        role: "User",
        status: "Active"
    };
}

test("signin rejects a wrong password for an existing email", async (t) => {
    const user = await activeUser();
    t.mock.method(signinRepository, "findUserByEmail", async () => user);

    const result = await signinService.signin({
        email: user.email,
        password: "wrong-password"
    });

    assert.equal(result.success, false);
    assert.equal(result.statusCode, 401);
    assert.equal(result.message, "Invalid email or password.");
});

test("signin accepts the correct password", async (t) => {
    const user = await activeUser();
    t.mock.method(signinRepository, "findUserByEmail", async () => user);
    t.mock.method(userSessionService, "createUserSession", async (data) => ({
        id: 91,
        user_id: data.userId,
        login_time: new Date("2026-07-23T05:00:00.000Z"),
        session_status: "Active",
        ip_address: data.ipAddress,
        user_agent: data.userAgent
    }));
    const originalJwtSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = "test-only-jwt-secret";
    t.after(() => {
        if (originalJwtSecret === undefined) {
            delete process.env.JWT_SECRET;
        } else {
            process.env.JWT_SECRET = originalJwtSecret;
        }
    });

    const result = await signinService.signin({
        email: user.email,
        password: "correct-password",
        ipAddress: "127.0.0.1",
        userAgent: "Test Browser"
    });

    const tokenPayload = jwt.verify(
        result.data.token,
        process.env.JWT_SECRET
    );

    assert.equal(result.success, true);
    assert.equal(result.statusCode, 200);
    assert.equal(typeof result.data.token, "string");
    assert.equal(tokenPayload.sessionId, 91);
    assert.equal(result.data.session.id, 91);
    assert.equal(result.data.session.status, "Active");
    assert.equal(result.data.user.email, user.email);
});
