const express = require("express");

const router = express.Router();

const signupController = require("./signupController");

// POST: /api/signup
router.post("/", signupController.signup);

module.exports = router;