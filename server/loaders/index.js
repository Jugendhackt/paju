const mysqlLoader = require("./mysql");
const spotifyLoader = require("./spotify");
const nuxtLoader = require("./nuxt");

module.exports = async function({
  expressApp
}) {
  await nuxtLoader(expressApp);

  const sqlConnection = await mysqlLoader();
  console.log("MySqlDB Intialized");

  const spotfyApi = await spotifyLoader(sqlConnection, expressApp);
  console.log("Spotify API Intialized");

  // await expressLoader({ app: expressApp });
  // console.log('Express Intialized');

  // ... more loaders can be here
};
