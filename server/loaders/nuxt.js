const { Nuxt, Builder } = require("nuxt");

// Import and Set Nuxt.js options
const config = require("../../nuxt.config.js");

config.dev = process.env.NODE_ENV !== "production";

module.exports = async app => {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  return nuxt;
};
