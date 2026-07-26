const test = require("node:test");
const assert = require("node:assert/strict");

const signupValidation = require("./signupValidation");

test("validateSignup handles missing request body without crashing", () => {
  const result = signupValidation.validateSignup();

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes("Full Name is required."));
  assert.ok(result.errors.includes("Email is required."));
  assert.ok(result.errors.includes("Password is required."));
});

test("validateSignup accepts the frontend registration payload", () => {
  const result = signupValidation.validateSignup({
    name: "Jane Doe",
    company: "Example Ltd",
    email: "jane@example.com",
    password: "correct horse battery staple",
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});
