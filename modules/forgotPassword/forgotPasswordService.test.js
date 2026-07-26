const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcrypt");
const forgotPasswordRepository =
    require("./forgotPasswordRepository");
const forgotPasswordService =
    require("./forgotPasswordService");

test("requestPasswordReset stores only a SHA-256 token hash", async (t) => {
    let savedToken;

    t.mock.method(
        forgotPasswordRepository,
        "findUserByEmail",
        async () => ({
            id: 11,
            full_name: "Test User",
            email: "test@example.com",
            status: "Active"
        })
    );
    t.mock.method(
        forgotPasswordRepository,
        "saveResetToken",
        async (data) => {
            savedToken = data;
            return { id: 1 };
        }
    );

    const result =
        await forgotPasswordService.requestPasswordReset({
            email: "test@example.com",
            ipAddress: "127.0.0.1"
        });
    const token =
        new URL(result.delivery.resetLink)
            .searchParams.get("token");

    assert.equal(token.length, 64);
    assert.equal(savedToken.tokenHash.length, 64);
    assert.notEqual(savedToken.tokenHash, token);
    assert.equal(
        savedToken.tokenHash,
        forgotPasswordService.hashResetToken(token)
    );
});

test("resetPassword bcrypt-hashes the password and completes reset", async (t) => {
    let completedReset;

    t.mock.method(
        forgotPasswordRepository,
        "findValidToken",
        async () => ({
            id: 5,
            user_id: 11
        })
    );
    t.mock.method(
        forgotPasswordRepository,
        "completePasswordReset",
        async (data) => {
            completedReset = data;
            return true;
        }
    );

    const result =
        await forgotPasswordService.resetPassword({
            token: "a".repeat(64),
            password: "NewTest@123"
        });

    assert.equal(result.success, true);
    assert.equal(completedReset.resetTokenId, 5);
    assert.equal(completedReset.userId, 11);
    assert.equal(
        await bcrypt.compare(
            "NewTest@123",
            completedReset.passwordHash
        ),
        true
    );
});

test("resetPassword rejects an invalid or expired token", async (t) => {
    t.mock.method(
        forgotPasswordRepository,
        "findValidToken",
        async () => null
    );

    const result =
        await forgotPasswordService.resetPassword({
            token: "b".repeat(64),
            password: "NewTest@123"
        });

    assert.equal(result.success, false);
    assert.equal(result.statusCode, 400);
});
