// ==========================================================
// Inspection Socket Handler
// File:
// modules/inspection/inspectionSocket.js
//
// Receives inspection data from Python Edge Node
// ==========================================================

const inspectionService =
  require(
    "./inspectionService"
  );

// ==========================================================
// REGISTER INSPECTION SOCKET
// ==========================================================

function registerInspectionSocket(
  io,
  socket
) {
  socket.on(
    "inspection_status",

    async (
      inspectionData
    ) => {
      try {
        console.log(
          "[INSPECTION] Received:",
          inspectionData.event_id
        );

        const result =
          await inspectionService
            .createInspection(
              inspectionData
            );

        // ==================================================
        // DUPLICATE EVENT
        // ==================================================

        if (
          result.duplicate
        ) {
          console.warn(
            "[INSPECTION] Duplicate:",
            inspectionData.event_id
          );

          socket.emit(
            "inspection_save_response",

            {
              success:
                false,

              duplicate:
                true,

              event_id:
                inspectionData
                  .event_id,

              message:
                "Inspection event already exists",
            }
          );

          return;
        }

        // ==================================================
        // DATABASE SAVE SUCCESS
        // ==================================================

        console.log(
          "[INSPECTION] Saved:",

          result.data.id
        );

        // Send PostgreSQL record
        // to React frontend
        io.emit(
          "inspection_update",

          result.data
        );

        // Send database confirmation
        // to Python Edge Node
        socket.emit(
          "inspection_save_response",

          {
            success:
              true,

            database_id:
              result.data.id,

            event_id:
              result.data
                .event_id,
          }
        );
      } catch (error) {
        console.error(
          "[INSPECTION ERROR]",

          error.message
        );

        socket.emit(
          "inspection_save_response",

          {
            success:
              false,

            event_id:
              inspectionData
                ?.event_id,

            error:
              error.message,
          }
        );
      }
    }
  );
}

// ==========================================================
// EXPORT
// ==========================================================

module.exports =
  registerInspectionSocket;