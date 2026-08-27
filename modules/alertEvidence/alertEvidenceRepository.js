const db = require("../../database/postgres");

async function findByEventId(eventId) {
  const rows = await db.query(
    `SELECT * FROM alert_evidence WHERE event_id = $1 LIMIT 1;`,
    [eventId]
  );
  return rows[0] || null;
}

async function create(record) {
  const rows = await db.query(
    `
      INSERT INTO alert_evidence (
        event_id, timestamp, site_id, section_id, camera_id,
        event_type, status, confidence, details, captured_data,
        evidence_filename, evidence_path
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12
      )
      RETURNING *;
    `,
    [
      record.event_id,
      record.timestamp,
      record.site_id,
      record.section_id,
      record.camera_id,
      record.event_type,
      record.status,
      record.confidence,
      record.details,
      record.captured_data,
      record.evidence_filename,
      record.evidence_path,
    ]
  );
  return rows[0];
}

async function findLatest(limit) {
  return db.query(
    `SELECT * FROM alert_evidence ORDER BY timestamp DESC LIMIT $1;`,
    [limit]
  );
}

module.exports = { create, findByEventId, findLatest };
