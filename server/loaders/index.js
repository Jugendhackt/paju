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
  spotfyApi: undefined,
  async init({
    expressApp
  }) {
    await nuxtLoader(expressApp);

    this.sqlConnection = await mysqlLoader();
    consola.success("MySqlDB Intialized");

    this.spotfyApi = await spotifyLoader(this.sqlConnection, expressApp);
    consola.success("Spotify API Intialized");

    // *** Debug
    const playlist = new PlaylistService(this.spotfyApi);
    console.debug(playlist.searchTracks("Take on me"));
    // ***
  }
};
