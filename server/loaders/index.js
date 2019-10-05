const consola = require("consola");

// *** Debug
const QRCode = require("qrcode");
const PlaylistService = require("../services/playlist.js");
// ***

// import Loaders
const mysqlLoader = require("./mysql");
const spotifyLoader = require("./spotify");
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

    await nuxtLoader(expressApp);
    consola.success("Nuxt initialized");

    await nuxtLoader(expressApp);
    consola.success("Nuxt Initialized");

    // *** Debug
    QRCode.toString("www.google.de", {type: "terminal"}, (_err, url) => {
      console.log(url);
    });
    
    const playlist = new PlaylistService(this.spotifyApi, this.sqlConnection);

    const tracks = await playlist.searchTracks("Take on me").catch(e => { console.error(e); });

    tracks.forEach(track => {
      playlist.addSong(track.uri);
    });
    // ***
  }
};
