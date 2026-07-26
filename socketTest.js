// ==========================================================
// Socket.IO Inspection Database Test
// File: socketTest.js
// ==========================================================

const {
  io,
} = require(
  "socket.io-client"
);

// ==========================================================
// CONNECT TO BACKEND
// ==========================================================

const socket =
  io(
    "http://localhost:3000"
  );

// ==========================================================
// CONNECTION SUCCESS
// ==========================================================

socket.on(
  "connect",

  () => {
    console.log(
      "Connected to backend"
    );

    console.log(
      "Socket ID:",
      socket.id
    );

    // Create a unique event ID
    const eventId =
      `TEST-${Date.now()}`;

    const testInspection = {
      site_id:
        "SITE-001",

      section_id:
        "SECTION-A",

      camera_id:
        "camera_1",

      captured_data:
        "GAS-2026-TEST",

      event_id:
        eventId,

      event_type:
        "emboss_inspection",

      status:
        "PASS",

      evidence_link:
        "",

      comments:
        "PostgreSQL database test",

      remarks:
        "Test inspection record",

      confidence:
        0.98,

      timestamp:
        new Date()
          .toISOString(),
    };

    console.log(
      "\nSending inspection:"
    );

    console.log(
      testInspection
    );

    // Send inspection to backend
    socket.emit(
      "inspection_status",

      testInspection
    );
  }
);

// ==========================================================
// DATABASE SAVE RESPONSE
// ==========================================================

socket.on(
  "inspection_save_response",

  (response) => {
    console.log(
      "\nDatabase response:"
    );

    console.log(
      response
    );

    if (
      response.success
    ) {
      console.log(
        "\nDATABASE SAVE SUCCESSFUL"
      );

      console.log(
        "Database ID:",
        response.database_id
      );
    } else {
      console.log(
        "\nDATABASE SAVE FAILED"
      );
    }

    socket.disconnect();

    process.exit(
      response.success
        ? 0
        : 1
    );
  }
);

// ==========================================================
// CONNECTION ERROR
// ==========================================================

socket.on(
  "connect_error",

  (error) => {
    console.error(
      "Backend connection failed:",
      error.message
    );

    process.exit(
      1
    );
  }
);