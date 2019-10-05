const consola = require("consola");

// *** Debug
//  inport Service
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
    await nuxtLoader(expressApp);
    consola.success("Nuxt Initialized");

    this.sqlConnection = await mysqlLoader();
    consola.success("MySqlDB Initialized");

    this.spotifyAPI = await spotifyLoader(this.sqlConnection, expressApp);
    consola.success("Spotify API Initialized");

    // *** Debug
    const playlist = new PlaylistService(this.spotifyAPI);
    consola.debug("ok", await playlist.searchTracks("Take on me").catch(e => { consola.error(e); }));
    // ***
  }
};
