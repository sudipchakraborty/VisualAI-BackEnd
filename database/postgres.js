// ==========================================================
// Generic Reusable PostgreSQL Database Module
// File: database/postgres.js
// ==========================================================

const {
  Pool,
} = require("pg");

const postgresConfig =
  require(
    "../config/postgresConfig"
  );

// ==========================================================
// POSTGRESQL CLASS
// ==========================================================

class PostgreSQL {
  constructor() {
    this.pool =
      new Pool(
        postgresConfig
      );

    this.isConnected =
      false;

    this.registerEvents();
  }

  // ========================================================
  // CONNECTION EVENTS
  // ========================================================

  registerEvents() {
    this.pool.on(
      "connect",

      () => {
        this.isConnected =
          true;
      }
    );

    this.pool.on(
      "error",

      (error) => {
        this.isConnected =
          false;

        console.error(
          "[DB] Unexpected PostgreSQL error:",
          error.message
        );
      }
    );
  }

  // ========================================================
  // TEST DATABASE CONNECTION
  // ========================================================

  async connect() {
    try {
      const result =
        await this.pool.query(
          `
          SELECT
              NOW()
              AS database_time
          `
        );

      this.isConnected =
        true;

      console.log(
        "[DB] PostgreSQL connected"
      );

      console.log(
        "[DB] Server time:",
        result.rows[0]
          .database_time
      );

      return true;
    } catch (error) {
      this.isConnected =
        false;

      console.error(
        "[DB] PostgreSQL connection failed:",
        error.message
      );

      throw error;
    }
  }

  // ========================================================
  // CREATE
  // ========================================================

  async insert(
    table,
    data
  ) {
    try {
      const columns =
        Object.keys(data);

      const values =
        Object.values(data);

      if (
        columns.length === 0
      ) {
        throw new Error(
          "Insert data cannot be empty"
        );
      }

      const placeholders =
        values.map(
          (_, index) =>
            `$${index + 1}`
        );

      const sql = `
        INSERT INTO ${table}
        (
          ${columns.join(", ")}
        )

        VALUES
        (
          ${placeholders.join(
            ", "
          )}
        )

        RETURNING *;
      `;

      const result =
        await this.pool.query(
          sql,
          values
        );

      return (
        result.rows[0] ||
        null
      );
    } catch (error) {
      console.error(
        "[DB INSERT ERROR]",
        error.message
      );

      throw error;
    }
  }

  // ========================================================
  // READ ALL
  // ========================================================

  async findAll(
    table,
    orderBy = "id DESC"
  ) {
    try {
      const sql = `
        SELECT *

        FROM ${table}

        ORDER BY ${orderBy};
      `;

      const result =
        await this.pool.query(
          sql
        );

      return result.rows;
    } catch (error) {
      console.error(
        "[DB FIND ALL ERROR]",
        error.message
      );

      throw error;
    }
  }

  // ========================================================
  // READ ONE
  // ========================================================

  async findById(
    table,
    id
  ) {
    try {
      const sql = `
        SELECT *

        FROM ${table}

        WHERE id = $1;
      `;

      const result =
        await this.pool.query(
          sql,
          [id]
        );

      return (
        result.rows[0] ||
        null
      );
    } catch (error) {
      console.error(
        "[DB FIND BY ID ERROR]",
        error.message
      );

      throw error;
    }
  }

  // ========================================================
  // UPDATE
  // ========================================================

  async update(
    table,
    id,
    data
  ) {
    try {
      const columns =
        Object.keys(data);

      const values =
        Object.values(data);

      if (
        columns.length === 0
      ) {
        throw new Error(
          "Update data cannot be empty"
        );
      }

      const setClause =
        columns.map(
          (
            column,
            index
          ) =>
            `${column} = $${index + 1}`
        );

      const sql = `
        UPDATE ${table}

        SET
          ${setClause.join(
            ", "
          )}

        WHERE
          id = $${columns.length + 1}

        RETURNING *;
      `;

      const result =
        await this.pool.query(
          sql,

          [
            ...values,
            id,
          ]
        );

      return (
        result.rows[0] ||
        null
      );
    } catch (error) {
      console.error(
        "[DB UPDATE ERROR]",
        error.message
      );

      throw error;
    }
  }

  // ========================================================
  // DELETE
  // ========================================================

  async delete(
    table,
    id
  ) {
    try {
      const sql = `
        DELETE

        FROM ${table}

        WHERE id = $1

        RETURNING *;
      `;

      const result =
        await this.pool.query(
          sql,
          [id]
        );

      return (
        result.rows[0] ||
        null
      );
    } catch (error) {
      console.error(
        "[DB DELETE ERROR]",
        error.message
      );

      throw error;
    }
  }

  // ========================================================
  // CUSTOM PARAMETERIZED QUERY
  // ========================================================

  async query(
    sql,
    parameters = []
  ) {
    try {
      const result =
        await this.pool.query(
          sql,
          parameters
        );

      return result.rows;
    } catch (error) {
      console.error(
        "[DB QUERY ERROR]",
        error.message
      );

      throw error;
    }
  }

  // ========================================================
  // CLOSE CONNECTION POOL
  // ========================================================

  async close() {
    await this.pool.end();

    this.isConnected =
      false;

    console.log(
      "[DB] PostgreSQL connection pool closed"
    );
  }
}

// ==========================================================
// SINGLE DATABASE INSTANCE
// ==========================================================

const database =
  new PostgreSQL();

module.exports =
  database;