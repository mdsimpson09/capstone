"use strict";

/** Express app for jobly. */
require('dotenv').config();
const corsMiddleware = require('./src/middleware/cors');


const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./src/middleware/auth");
const authRoutes = require("./src/routes/auth");
// const companiesRoutes = require("./routes/companies");
const usersRoutes = require("./src/routes/users");
// const jobsRoutes = require("./routes/jobs");

const morgan = require("morgan");

const app = express();

app.use(corsMiddleware);
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
// app.use("/companies", companiesRoutes);
app.use("/users", usersRoutes);
// app.use("/jobs", jobsRoutes);


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;