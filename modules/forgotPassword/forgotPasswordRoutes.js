const express = require("express");
const forgotPasswordController =
    require("./forgotPasswordController");

const router = express.Router();

router.post(
    "/request",
    forgotPasswordController.requestReset
);

router.post(
    "/reset",
    forgotPasswordController.resetPassword
);

module.exports = router;
