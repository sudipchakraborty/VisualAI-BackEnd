// ==========================================================
// Industrial Visual AI Backend
// File: server.js
// ==========================================================

// Environment variables must load first
require(
  "dotenv"
).config();

const signupRoutes = require("./modules/signup/signupRoutes");
const signinRoutes = require("./modules/signin");
const userSessionRoutes =
    require(
        "./modules/userSession"
    );
const forgotPasswordRoutes =
    require(
        "./modules/forgotPassword"
    );
const whatsappRoutes =
  require("./modules/whatsapp/whatsappRoutes");

const dashboardRoutes =
  require("./dashboard/dashboardRoutes");

const express =
  require("express");

const app =
  express();

const http =
  require("http");

const cors =
  require("cors");

const {
  Server,
} = require(
  "socket.io"
);

const db =
  require(
    "./database/postgres"
  );

const createUsersTable =
  require(
    "./database/migrations/createUsersTable"
  );
const createPasswordResetTokensTable =
  require(
    "./database/migrations/createPasswordResetTokensTable"
  );

const inspectionRoutes =
  require(
    "./modules/inspection/inspectionRoutes"
  );

const initializeSocket =
  require(
    "./sockets/socketManager"
  );

// ==========================================================
// APPLICATION
// ==========================================================



app.use(
  cors({
    origin:
      "*",
  })
);

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.use("/api/signup", signupRoutes);

app.use("/api/auth/register", signupRoutes);
app.use("/api/signin", signinRoutes);
app.use("/api/auth/login", signinRoutes);
app.use(
    "/api/sessions",
    userSessionRoutes
);
app.use(
    "/api/forgot-password",
    forgotPasswordRoutes
);
app.use("/api/whatsapp", whatsappRoutes);

// ==========================================================
// HTTP SERVER
// ==========================================================

const httpServer =
  http.createServer(
    app
  );

// ==========================================================
// SOCKET.IO
// ==========================================================

const io =
  new Server(
    httpServer,

    {
      cors: {
        origin:
          "*",

        methods: [
          "GET",
          "POST",
        ],
      },
    }
  );

initializeSocket(
  io
);

// ==========================================================
// API ROUTES
// ==========================================================

app.use(
  "/api/inspections",

  inspectionRoutes
);

// ==========================================================
// HEALTH API
// ==========================================================

app.get(
  "/health",

  async (
    request,
    response
  ) => {
    try {
      await db.query(
        "SELECT 1"
      );

      response.json({
        status:
          "running",

        service:
          "Industrial Visual AI Backend",

        database:
          "connected",

        socket_clients:
          io.engine
            .clientsCount,
      });
    } catch (error) {
      response
        .status(503)
        .json({
          status:
            "error",

          database:
            "disconnected",

          error:
            error.message,
        });
    }
  }
);

// ==========================================================
// START SERVER
// ==========================================================

const PORT =
  Number(
    process.env.PORT
  ) || 3000;

async function startServer() {
  try {
    await db.connect();

    await createUsersTable();

    await createPasswordResetTokensTable();

    httpServer.listen(
      PORT,

      "0.0.0.0",

      () => {
        console.log(
          "================================"
        );

        console.log(
          "Industrial Visual AI Backend"
        );

        console.log(
          `Port: ${PORT}`
        );

        console.log(
          "PostgreSQL: Connected"
        );

        console.log(
          "Socket.IO: Ready"
        );

        console.log(
          "================================"
        );
      }
    );
  } catch (error) {
    console.error(
      "Backend startup failed:",
      error.message
    );

    process.exit(
      1
    );
  }
}

startServer();
