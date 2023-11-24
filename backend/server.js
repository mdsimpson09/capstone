// "use strict";

// const app = require("./app");
// const { PORT } = require("./config");
// require('dotenv').config();

// app.listen(PORT, function () {
//   console.log(`Started on http://localhost:${PORT}`);
// });
// src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');
const matchRoutes = require('./src/routes/matchRoutes');
const { PORT } = require('./src/config/config');


const app = express();
// const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});