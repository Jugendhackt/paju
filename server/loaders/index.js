const consola = require("consola");

// *** Debug
// import Service
const PlaylistService = require("../services/playlist.js");
// ***

// import Loaders
const mysqlLoader = require("./mysql");
const spotifyLoader = require("./spotify");
const nuxtLoader = require("./nuxt");

module.exports = {
  sqlConnection: undefined,
  spotifyAPI: undefined,
  async init({
    expressApp
  }) {
    this.sqlConnection = await mysqlLoader();
    consola.success("MySqlDB initialized");

    this.spotifyAPI = await spotifyLoader(this.sqlConnection, expressApp);
    consola.success("Spotify Authorization initialized");

    await nuxtLoader(expressApp);
    consola.success("Nuxt initialized");

    // *** Debug
    const playlist = new PlaylistService(this.spotifyAPI);
    consola.debug("ok", await playlist.searchTracks("Take on me").catch(e => { consola.error(e); }));
    // ***
  }
};
