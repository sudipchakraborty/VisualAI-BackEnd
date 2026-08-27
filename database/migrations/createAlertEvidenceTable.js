if (require.main === module) {
  require("dotenv").config();
}

const db = require("../postgres");

async function createAlertEvidenceTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS alert_evidence (
      id BIGSERIAL PRIMARY KEY,
      event_id VARCHAR(160) NOT NULL UNIQUE,
      timestamp TIMESTAMPTZ NOT NULL,
      site_id VARCHAR(100) NOT NULL,
      section_id VARCHAR(100),
      camera_id VARCHAR(100) NOT NULL,
      event_type VARCHAR(160) NOT NULL,
      status VARCHAR(20) NOT NULL,
      confidence DOUBLE PRECISION,
      details TEXT,
      captured_data JSONB,
      evidence_filename TEXT NOT NULL,
      evidence_path TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS alert_evidence_timestamp_idx
      ON alert_evidence (timestamp DESC);
  `);
}

module.exports = createAlertEvidenceTable;

if (require.main === module) {
  createAlertEvidenceTable()
    .then(() => console.log("[DB] alert_evidence table is ready"))
    .catch((error) => {
      console.error("[DB] alert_evidence migration failed:", error.message);
      process.exitCode = 1;
    })
    .finally(() => db.close());
}
