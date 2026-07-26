// ==========================================================
// Inspection Service
// File:
// modules/inspection/inspectionService.js
//
// Responsibility:
// Validation and inspection business logic
// ==========================================================

const inspectionRepository =
  require(
    "./inspectionRepository"
  );

// ==========================================================
// VALID STATUS VALUES
// ==========================================================

const VALID_STATUS = [
  "PASS",
  "FAIL",
  "WARNING",
  "UNKNOWN",
];

// ==========================================================
// VALIDATE INSPECTION
// ==========================================================

function validateInspection(
  inspectionData
) {
  const requiredFields = [
    "site_id",

    "camera_id",

    "event_id",

    "status",
  ];

  const missingFields =
    requiredFields.filter(
      (field) =>
        inspectionData[
          field
        ] === undefined ||
        inspectionData[
          field
        ] === null ||
        inspectionData[
          field
        ] === ""
    );

  if (
    missingFields.length > 0
  ) {
    throw new Error(
      `Missing required fields: ${missingFields.join(
        ", "
      )}`
    );
  }

  const status =
    String(
      inspectionData.status
    ).toUpperCase();

  if (
    !VALID_STATUS.includes(
      status
    )
  ) {
    throw new Error(
      `Invalid inspection status: ${status}`
    );
  }
}

// ==========================================================
// NORMALIZE INSPECTION
// ==========================================================

function normalizeInspection(
  inspectionData
) {
  return {
    timestamp:
      inspectionData.timestamp
      || new Date(),

    site_id:
      inspectionData.site_id,

    section_id:
      inspectionData.section_id
      || null,

    camera_id:
      inspectionData.camera_id,

    captured_data:
      inspectionData.captured_data
      || null,

    event_id:
      inspectionData.event_id,

    event_type:
      inspectionData.event_type
      || null,

    status:
      String(
        inspectionData.status
      ).toUpperCase(),

    evidence_link:
      inspectionData.evidence_link
      || null,

    comments:
      inspectionData.comments
      || null,

    remarks:
      inspectionData.remarks
      || null,

    confidence:
      inspectionData.confidence
      ?? null,
  };
}

// ==========================================================
// CREATE INSPECTION
// ==========================================================

async function createInspection(
  inspectionData
) {
  validateInspection(
    inspectionData
  );

  const existingRecord =
    await inspectionRepository
      .findByEventId(
        inspectionData.event_id
      );

  if (
    existingRecord
  ) {
    return {
      created:
        false,

      duplicate:
        true,

      data:
        existingRecord,
    };
  }

  const normalizedData =
    normalizeInspection(
      inspectionData
    );

  const savedRecord =
    await inspectionRepository
      .create(
        normalizedData
      );

  return {
    created:
      true,

    duplicate:
      false,

    data:
      savedRecord,
  };
}

// ==========================================================
// GET LATEST INSPECTIONS
// ==========================================================

async function getLatestInspections(
  limit = 1000
) {
  let safeLimit =
    Number(limit);

  if (
    !Number.isInteger(
      safeLimit
    ) ||
    safeLimit < 1
  ) {
    safeLimit =
      1000;
  }

  if (
    safeLimit > 5000
  ) {
    safeLimit =
      5000;
  }

  return await inspectionRepository
    .findLatest(
      safeLimit
    );
}

// ==========================================================
// EXPORT
// ==========================================================

module.exports = {
  createInspection,

  getLatestInspections,
};