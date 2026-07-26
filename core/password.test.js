const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { verifyPassword } = require("./password");

test("verifyPassword supports existing scrypt password hashes", async () => {
    const salt = "0123456789abcdef0123456789abcdef";
    const key = crypto.scryptSync("Test@123", salt, 64);
    const storedHash = `scrypt:${salt}:${key.toString("hex")}`;

    assert.equal(await verifyPassword("Test@123", storedHash), true);
    assert.equal(await verifyPassword("wrong-password", storedHash), false);
});
