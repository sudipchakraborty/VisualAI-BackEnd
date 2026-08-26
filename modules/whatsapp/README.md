# Twilio WhatsApp alerts

Configure the `TWILIO_*` values in the project `.env`, then call the module from
an inspection or alert service:

```js
const { sendWhatsAppAlert } = require("../whatsapp");

await sendWhatsAppAlert({
  message: "Visual AI alert: PPE violation detected on Camera 1",
  mediaUrl: "https://example.com/evidence.jpg", // optional, must be public
});
```

Pass `to: "+919876543210"` to override `TWILIO_WHATSAPP_TO` for one message.
The module automatically adds Twilio's required `whatsapp:` address prefix.
Ten-digit Indian mobile numbers are normalized to the `+91` country code.

For the demonstration frontend, enable `WHATSAPP_DEMO_ENABLED=true` and call:

```http
POST /api/whatsapp/send
Content-Type: application/json

{"mobileNumber":"7003034313","message":"Visual AI demonstration alert"}
```

An `SK...` credential is an API Key SID, so it requires
`TWILIO_API_KEY_SECRET` and the parent `TWILIO_ACCOUNT_SID` (`AC...`). As an
alternative, omit both API-key variables and configure `TWILIO_AUTH_TOKEN`.
