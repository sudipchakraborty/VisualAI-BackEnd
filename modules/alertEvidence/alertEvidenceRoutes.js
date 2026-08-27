const express = require("express");
const controller = require("./alertEvidenceController");

const router = express.Router();
router.get("/", controller.getLatest);
router.get("/event/:eventId", controller.getByEventId);
router.post("/", controller.create);

module.exports = router;
