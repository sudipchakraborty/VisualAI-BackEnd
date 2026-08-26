const twilio = require("twilio");

function required(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function whatsappAddress(value, name) {
  const number = value?.trim();

  if (!number) {
    throw new Error(`Missing WhatsApp number: ${name}`);
  }

  return number.startsWith("whatsapp:")
    ? number
    : `whatsapp:${number}`;
}

function normalizeMobileNumber(value) {
  const raw = String(value || "").trim();
  const compact = raw.replace(/[\s()-]/g, "");
  let normalized = compact;

  if (/^\d{10}$/.test(compact)) {
    normalized = `+91${compact}`;
  } else if (/^91\d{10}$/.test(compact)) {
    normalized = `+${compact}`;
  }

  if (!/^\+[1-9]\d{7,14}$/.test(normalized)) {
    throw new Error(
      "Mobile number must be a valid E.164 number or a 10-digit Indian number"
    );
  }

  return normalized;
}

function createTwilioClient() {
  const accountSid = required("TWILIO_ACCOUNT_SID");
  const apiKeySid = process.env.TWILIO_API_KEY_SID?.trim();
  const apiKeySecret = process.env.TWILIO_API_KEY_SECRET?.trim();

  if (apiKeySid || apiKeySecret) {
    if (!apiKeySid || !apiKeySecret) {
      throw new Error(
        "TWILIO_API_KEY_SID and TWILIO_API_KEY_SECRET must both be configured"
      );
    }

    return twilio(apiKeySid, apiKeySecret, { accountSid });
  }

  return twilio(accountSid, required("TWILIO_AUTH_TOKEN"));
}

async function sendWhatsAppAlert({ to, message, mediaUrl } = {}) {
  const body = message?.trim();

  if (!body) {
    throw new Error("WhatsApp alert message is required");
  }

  const payload = {
    from: whatsappAddress(
      required("TWILIO_WHATSAPP_FROM"),
      "TWILIO_WHATSAPP_FROM"
    ),
    to: whatsappAddress(
      normalizeMobileNumber(to || process.env.TWILIO_WHATSAPP_TO),
      "to or TWILIO_WHATSAPP_TO"
    ),
    body,
  };

  if (mediaUrl) {
    payload.mediaUrl = Array.isArray(mediaUrl) ? mediaUrl : [mediaUrl];
  }

  const result = await createTwilioClient().messages.create(payload);

  return {
    sid: result.sid,
    status: result.status,
    to: result.to,
  };
}

module.exports = {
  normalizeMobileNumber,
  sendWhatsAppAlert,
};
