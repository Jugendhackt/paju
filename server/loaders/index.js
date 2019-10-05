const mysqlLoader = require("./mysql");
const spotifyLoader = require("./spotify");

module.exports = async function({
  expressApp
}) {
  const sqlConnection = await mysqlLoader();
  console.log("MySqlDB Intialized");

  const sql = "SELECT * FROM `playlist` ";

  sqlConnection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.debug(`Result: ${JSON.stringify(result)}`);
  });

  const spotfyApi = await spotifyLoader(sqlConnection, expressApp);
  console.log("Spotify API Intialized");

  // await expressLoader({ app: expressApp });
  // console.log('Express Intialized');

  // ... more loaders can be here
};
