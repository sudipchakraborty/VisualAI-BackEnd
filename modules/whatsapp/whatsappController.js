const {
  normalizeMobileNumber,
  sendWhatsAppAlert,
} = require("./whatsappService");

async function sendAlert(request, response) {
  if (process.env.WHATSAPP_DEMO_ENABLED !== "true") {
    return response.status(403).json({
      success: false,
      message: "WhatsApp demonstration messaging is disabled.",
    });
  }

  const mobileNumber = request.body?.mobileNumber;
  const message = String(request.body?.message || "").trim();

  if (!message || message.length > 1600) {
    return response.status(400).json({
      success: false,
      message: "Message is required and must not exceed 1600 characters.",
    });
  }

  try {
    const to = normalizeMobileNumber(mobileNumber);
    const result = await sendWhatsAppAlert({ to, message });

    return response.status(202).json({
      success: true,
      message: "WhatsApp alert accepted by Twilio.",
      delivery: result,
    });
  } catch (error) {
    const isValidationError = error.message.startsWith("Mobile number");

    console.error("WhatsApp alert failed:", error.message);

    return response.status(isValidationError ? 400 : 502).json({
      success: false,
      message: isValidationError
        ? error.message
        : "Twilio could not send the WhatsApp alert.",
    });
  }
}

module.exports = { sendAlert };
