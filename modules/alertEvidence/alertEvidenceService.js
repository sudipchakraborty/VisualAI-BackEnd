const fs = require("fs/promises");
const path = require("path");
const repository = require("./alertEvidenceRepository");

const evidenceDirectory = path.resolve(
  process.env.ALERT_EVIDENCE_DIR || path.join(__dirname, "..", "..", "data", "alert-evidence")
);
const maximumImageBytes = Number(process.env.ALERT_EVIDENCE_MAX_BYTES) || 10 * 1024 * 1024;
const validStatuses = new Set(["PASS", "FAIL", "WARNING", "UNKNOWN"]);

function requiredText(alert, field) {
  const value = String(alert[field] ?? "").trim();
  if (!value) throw new Error(`${field} is required.`);
  return value;
}

function decodeJpeg(imageBase64) {
  const normalized = String(imageBase64 || "").replace(
    /^data:image\/jpeg;base64,/i,
    ""
  );
  if (!normalized) throw new Error("JPEG evidence is required.");
  const image = Buffer.from(normalized, "base64");
  if (image.length < 4 || image[0] !== 0xff || image[1] !== 0xd8) {
    throw new Error("Evidence must be a valid JPEG image.");
  }
  if (image.length > maximumImageBytes) {
    throw new Error("Evidence image exceeds the configured size limit.");
  }
  return image;
}

function addEvidenceUrl(record) {
  return {
    ...record,
    evidence_url: `/alert-evidence-files/${encodeURIComponent(record.evidence_filename)}`,
  };
}

async function save(payload) {
  const alert = payload && payload.alert;
  if (!alert || typeof alert !== "object") throw new Error("alert is required.");
  const eventId = requiredText(alert, "event_id");
  const existing = await repository.findByEventId(eventId);
  if (existing) return { created: false, duplicate: true, data: addEvidenceUrl(existing) };

  const status = requiredText(alert, "status").toUpperCase();
  if (!validStatuses.has(status)) throw new Error(`Invalid status: ${status}`);
  const image = decodeJpeg(payload.image_base64);
  const safeEventId = eventId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 120);
  const filename = `${Date.now()}_${safeEventId}.jpg`;
  const absolutePath = path.join(evidenceDirectory, filename);
  const relativePath = path.posix.join("data", "alert-evidence", filename);
  await fs.mkdir(evidenceDirectory, { recursive: true });
  await fs.writeFile(absolutePath, image, { flag: "wx" });

  try {
    const record = await repository.create({
      event_id: eventId,
      timestamp: alert.timestamp || new Date(),
      site_id: requiredText(alert, "site_id"),
      section_id: String(alert.section_id || "").trim() || null,
      camera_id: requiredText(alert, "camera_id"),
      event_type: requiredText(alert, "event_type"),
      status,
      confidence: alert.confidence ?? null,
      details: alert.comments || alert.remarks || null,
      captured_data: alert.captured_data || null,
      evidence_filename: filename,
      evidence_path: relativePath,
    });
    return { created: true, duplicate: false, data: addEvidenceUrl(record) };
  } catch (error) {
    await fs.unlink(absolutePath).catch(() => undefined);
    throw error;
  }
}

async function latest(limitValue) {
  let limit = Number(limitValue || 100);
  if (!Number.isInteger(limit) || limit < 1) limit = 100;
  limit = Math.min(limit, 1000);
  return (await repository.findLatest(limit)).map(addEvidenceUrl);
}

async function findByEventId(eventId) {
  const record = await repository.findByEventId(String(eventId || "").trim());
  return record ? addEvidenceUrl(record) : null;
}

module.exports = { evidenceDirectory, findByEventId, latest, save };
