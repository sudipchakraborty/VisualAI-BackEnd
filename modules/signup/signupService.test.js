const test = require("node:test");
const assert = require("node:assert/strict");
const signupRepository = require("./signupRepository");
const signupService = require("./signupService");

test("signup hashes the password and saves a user record", async (t) => {
    let insertedData;

    t.mock.method(signupRepository, "findByEmail", async () => null);
    t.mock.method(signupRepository, "create", async (data) => {
        insertedData = data;

        return {
            id: 42,
            ...data,
            created_at: new Date("2026-07-22T00:00:00.000Z")
        };
    });

    const result = await signupService.signup({
        name: "Jane Doe",
        company: "Example Ltd",
        email: "Jane@Example.com",
        password: "secret-password"
    });

    assert.equal(insertedData.full_name, "Jane Doe");
    assert.equal(insertedData.email, "jane@example.com");
    assert.match(insertedData.password_hash, /^\$2[aby]\$\d{2}\$/);
    assert.equal(insertedData.password_hash.includes("secret-password"), false);
    assert.equal(result.data.id, 42);
    assert.equal("password_hash" in result.data, false);
});
