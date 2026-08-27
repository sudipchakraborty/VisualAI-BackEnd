const service = require("./alertEvidenceService");

async function create(request, response) {
  try {
    const result = await service.save(request.body);
    response.status(result.created ? 201 : 200).json({ success: true, ...result });
  } catch (error) {
    console.error("[ALERT EVIDENCE]", error.message);
    response.status(400).json({ success: false, message: error.message });
  }
}

async function getLatest(request, response) {
  try {
    const data = await service.latest(request.query.limit);
    response.json({ success: true, count: data.length, data });
  } catch (error) {
    console.error("[ALERT EVIDENCE]", error.message);
    response.status(500).json({ success: false, message: "Unable to load alert evidence." });
  }
}

async function getByEventId(request, response) {
  try {
    const data = await service.findByEventId(request.params.eventId);
    if (!data) {
      response.status(404).json({ success: false, message: "Evidence was not found." });
      return;
    }
    response.json({ success: true, data });
  } catch (error) {
    console.error("[ALERT EVIDENCE]", error.message);
    response.status(500).json({ success: false, message: "Unable to load evidence." });
  }
}

module.exports = { create, getByEventId, getLatest };
