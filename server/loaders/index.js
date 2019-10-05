const consola = require("consola");

// import Loaders
const mysqlLoader = require("./mysql");
const spotifyLoader = require("./spotify");
const playlistLoader = require("./playlist");
const nuxtLoader = require("./nuxt");

module.exports = {
  sqlConnection: undefined,
  spotifyApi: undefined,
  async init({
    expressApp
  }) {
    this.sqlConnection = await mysqlLoader();
    consola.success("MySqlDB initialized");

    this.spotifyApi = await spotifyLoader(this.sqlConnection, expressApp);
    consola.success("Spotify Authorization initialized");

    await playlistLoader(this.spotifyApi, this.sqlConnection, expressApp);
    consola.success("Playlist API initialized");

    await nuxtLoader(expressApp);
    consola.success("Nuxt initialized");
  }
};
