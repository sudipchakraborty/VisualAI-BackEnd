// ==========================================================
// Inspection Repository
// File:
// modules/inspection/inspectionRepository.js
//
// Responsibility:
// All inspection-related PostgreSQL operations
// ==========================================================

const db =
  require(
    "../../database/postgres"
  );

// ==========================================================
// CONFIGURATION
// ==========================================================

const TABLE_NAME =
  "inspection_records";

// ==========================================================
// CREATE INSPECTION
// ==========================================================

async function create(
  inspectionData
) {
  return await db.insert(
    TABLE_NAME,

    inspectionData
  );
}

// ==========================================================
// GET ALL INSPECTIONS
// ==========================================================

async function findAll() {
  return await db.query(
    `
    SELECT
      *

    FROM
      ${TABLE_NAME}

    ORDER BY
      timestamp DESC;
    `
  );
}

// ==========================================================
// GET LATEST INSPECTIONS
// ==========================================================

async function findLatest(
  limit = 1000
) {
  return await db.query(
    `
    SELECT
      *

    FROM
      ${TABLE_NAME}

    ORDER BY
      timestamp DESC

    LIMIT $1;
    `,

    [limit]
  );
}

// ==========================================================
// FIND INSPECTION BY DATABASE ID
// ==========================================================

async function findById(
  id
) {
  return await db.findById(
    TABLE_NAME,
    id
  );
}

// ==========================================================
// FIND INSPECTION BY EVENT ID
// ==========================================================

async function findByEventId(
  eventId
) {
  const rows =
    await db.query(
      `
      SELECT
        *

      FROM
        ${TABLE_NAME}

      WHERE
        event_id = $1

      LIMIT 1;
      `,

      [eventId]
    );

  return (
    rows[0] ||
    null
  );
}

// ==========================================================
// UPDATE INSPECTION
// ==========================================================

async function update(
  id,
  inspectionData
) {
  return await db.update(
    TABLE_NAME,
    id,
    inspectionData
  );
}

// ==========================================================
// DELETE INSPECTION
// ==========================================================

async function remove(
  id
) {
  return await db.delete(
    TABLE_NAME,
    id
  );
}

// ==========================================================
// EXPORT
// ==========================================================

module.exports = {
  create,

  findAll,

  findLatest,

  findById,

  findByEventId,

  update,

  remove,
};