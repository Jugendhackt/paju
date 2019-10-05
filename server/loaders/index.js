const consola = require("consola");

// *** Debug
// const QRCode = require("qrcode");
// const PlaylistService = require("../services/playlist.js");
// ***

// import Loaders
const mysqlLoader = require("./mysql");
const spotifyLoader = require("./spotify");
const playlistLoader = require("./playlist");
const nuxtLoader = require("./nuxt");

const context = {
  db: null,
  spotifyApi: null,
  spotifyAccessToken: null,
  app: null
};

module.exports = {
  async init(app) {
    context.app = app;

    await mysqlLoader(context);
    consola.success("MySqlDB initialized");

    await spotifyLoader(context);
    consola.success("Spotify Authorization initialized");

    await playlistLoader(context);
    consola.success("Playlist API initialized");

    await nuxtLoader(context);
    consola.success("Nuxt initialized");
  }
};
