require("dotenv").config();

const express = require("express");
const consola = require("consola");

// Import loaders
const loaders = require("./loaders/index.js");

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

async function start() {
  const app = express();

  await loaders.init(app);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}

start();
