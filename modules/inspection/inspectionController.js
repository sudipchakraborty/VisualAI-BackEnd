// ==========================================================
// Inspection HTTP Controller
// File:
// modules/inspection/inspectionController.js
// ==========================================================

const inspectionService =
  require(
    "./inspectionService"
  );

// ==========================================================
// GET INSPECTIONS
// ==========================================================

async function getInspections(
  request,
  response
) {
  try {
    const limit =
      request.query.limit
      || 1000;

    const inspections =
      await inspectionService
        .getLatestInspections(
          limit
        );

    response.status(
      200
    ).json({
      success:
        true,

      count:
        inspections.length,

      data:
        inspections,
    });
  } catch (error) {
    console.error(
      "[INSPECTION API]",
      error.message
    );

    response.status(
      500
    ).json({
      success:
        false,

      message:
        "Unable to retrieve inspection records",

      error:
        error.message,
    });
  }
}

// ==========================================================
// EXPORT
// ==========================================================

module.exports = {
  getInspections,
};