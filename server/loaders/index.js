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
  spoitfyApi: undefined,
  async init({
    expressApp
  }) {
    await nuxtLoader(expressApp);
    consola.success("Nuxt Intialized");

    this.sqlConnection = await mysqlLoader();
    consola.success("MySqlDB Intialized");

    this.spoitfyApi = await spotifyLoader(this.sqlConnection, expressApp);
    consola.success("Spotify API Intialized");

    // *** Debug
    const playlist = new PlaylistService(this.spoitfyApi);
    consola.debug("ok", await playlist.searchTracks("Take on me").catch(e => { consola.error(e); }));
    // ***
  }
};
