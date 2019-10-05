const consola = require("consola");

// *** Debug
// const QRCode = require("qrcode");
// const PlaylistService = require("../services/playlist.js");
// ***

// import Loaders
const mysqlLoader = require("./mysql");
const spotifyLoader = require("./spotify");
const playerLoader = require("./player");
const nuxtLoader = require("./nuxt");

const context = {
  db: null,
  spotifyAPI: null,
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

    await nuxtLoader(context);
    consola.success("Nuxt Initialized");

    // *** Debug
    /*
    QRCode.toString("www.google.de", { type: "terminal" }, (_err, url) => {
      console.log(url);
    });
    */

    /*
    const playlist = new PlaylistService(this.spotifyApi, this.sqlConnection);
    const tracks = await playlist.searchTracks("Take on me").catch(e => { console.error(e); });
    tracks.forEach(track => {
      playlist.addSong(track.uri);
    });
    */
    // ***
  }
};
