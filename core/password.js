const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const { promisify } = require("node:util");

const scrypt = promisify(crypto.scrypt);
const BCRYPT_ROUNDS = 12;

async function hashPassword(password) {
    return bcrypt.hash(String(password), BCRYPT_ROUNDS);
}

async function verifyPassword(password, storedHash) {
    if (typeof storedHash !== "string" || storedHash === "") {
        return false;
    }

    if (/^\$2[aby]\$/.test(storedHash)) {
        try {
            return await bcrypt.compare(String(password), storedHash);
        } catch {
            return false;
        }
    }

    // Compatibility for users registered before bcrypt was introduced.
    if (storedHash.startsWith("scrypt:")) {
        const [, salt, expectedHex] = storedHash.split(":");

        if (!salt || !/^[a-f0-9]+$/i.test(expectedHex || "")) {
            return false;
        }

        const expected = Buffer.from(expectedHex, "hex");
        const actual = await scrypt(String(password), salt, expected.length);

        return (
            actual.length === expected.length &&
            crypto.timingSafeEqual(actual, expected)
        );
    }

    return false;
}

module.exports = {
    hashPassword,
    verifyPassword
};
