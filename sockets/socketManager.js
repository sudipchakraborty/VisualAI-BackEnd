// ==========================================================
// Main Socket.IO Manager
// File:
// sockets/socketManager.js
// ==========================================================

const registerInspectionSocket =
  require(
    "../modules/inspection/inspectionSocket"
  );

// ==========================================================
// INITIALIZE SOCKET.IO
// ==========================================================

function initializeSocket(
  io
) {
  io.on(
    "connection",

    (socket) => {
      console.log(
        "[SOCKET] Connected:",
        socket.id
      );

      // Register inspection module
      registerInspectionSocket(
        io,
        socket
      );

      // Edge Node logs
      socket.on(
        "edge_log",

        (data) => {
          console.log(
            "[EDGE LOG]",
            data
          );

          io.emit(
            "log_update",
            data
          );
        }
      );

      socket.on(
        "disconnect",

        () => {
          console.log(
            "[SOCKET] Disconnected:",
            socket.id
          );
        }
      );
    }
  );
}

// ==========================================================
// EXPORT
// ==========================================================

module.exports =
  initializeSocket;