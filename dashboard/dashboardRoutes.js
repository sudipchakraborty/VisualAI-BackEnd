const express = require("express");

const router = express.Router();

const controller = require("./dashboardController");

router.get("/", controller.getDashboard);

router.post("/", controller.getDashboard);

module.exports = router;
