"use strict";
/** Database setup for gamer_date. */
const { Pool } = require("pg");
const { getDatabaseUri } = require("../config/config");

let db;

if (process.env.NODE_ENV === "production") {
  db = new Pool({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  db = new Pool({
    connectionString: getDatabaseUri(),
  });
}

module.exports = db;
