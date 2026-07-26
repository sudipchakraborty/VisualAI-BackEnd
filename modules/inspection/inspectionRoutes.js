// ==========================================================
// Inspection API Routes
// File:
// modules/inspection/inspectionRoutes.js
// ==========================================================

const express =
  require("express");

const inspectionController =
  require(
    "./inspectionController"
  );

const router =
  express.Router();

// ==========================================================
// GET
// /api/inspections
// ==========================================================

router.get(
  "/",

  inspectionController
    .getInspections
);

// ==========================================================
// EXPORT
// ==========================================================

module.exports =
  router;