const express = require("express");

const router = express.Router();

const signinController =
    require("./signinController");

const authenticateToken = require(
    "../common/middleware/authMiddleware"
);

// Public route
router.post(
    "/",
    signinController.signin
);

// Protected test route
router.get(
    "/profile",
    authenticateToken,
    signinController.profile
);

module.exports = router;
