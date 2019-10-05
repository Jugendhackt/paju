const express = require("express");
const consola = require("consola");
const {
  Nuxt,
  Builder
} = require("nuxt");

// Import and Set Nuxt.js options
const config = require("../nuxt.config.js");

// Import loaders
const loaders = require("./loaders/index.js/index.js.js.js.js");

config.dev = process.env.NODE_ENV !== "production";

async function start() {
  const app = express();

  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const {
    host,
    port
  } = nuxt.options.server;

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  await loaders({ expressApp: app });

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}

start();
