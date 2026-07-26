const express =
    require("express");

const userSessionController =
    require("./userSessionController");

const authenticateToken =
    require(
        "../common/middleware/authMiddleware"
    );

const router =
    express.Router();

router.post(
    "/logout",
    authenticateToken,
    userSessionController.logout
);

module.exports = router;
