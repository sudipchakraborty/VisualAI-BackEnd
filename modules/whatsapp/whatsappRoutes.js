const express = require("express");
const whatsappController = require("./whatsappController");

const router = express.Router();

router.post("/send", whatsappController.sendAlert);

module.exports = router;
