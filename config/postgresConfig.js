// ==========================================================
// PostgreSQL Configuration
// File: config/postgresConfig.js
// ==========================================================

module.exports = {
  host:
    process.env.DB_HOST ||
    "localhost",

  port:
    Number(
      process.env.DB_PORT
    ) || 5432,

  database:
    process.env.DB_NAME ||
    "gibraltar",

  user:
    process.env.DB_USER ||
    "postgres",

  password:
    process.env.DB_PASSWORD ||
    "postgres",

  max:
    Number(
      process.env.DB_POOL_MAX
    ) || 20,

  idleTimeoutMillis:
    30000,

  connectionTimeoutMillis:
    5000,
};