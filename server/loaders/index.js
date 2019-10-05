const consola = require("consola");

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
    consola.success("MySqlDB Initialized");

    this.spotifyAPI = await spotifyLoader(this.sqlConnection, expressApp);
    consola.success("Spotify API Initialized");

    await nuxtLoader(expressApp);
    consola.success("Nuxt Initialized");

    // *** Debug
    // Get Elvis' albums
    this.spotifyAPI.getArtistAlbums("43ZHCT0cAZBISjO8DG9PnE").then(
      data => {
        console.log("Artist albums", data.body);
      }, err => {
        console.error(err);
      }
    );
    const output = this.spotifyAPI;
    console.log(output);
    // ***
  }
};
