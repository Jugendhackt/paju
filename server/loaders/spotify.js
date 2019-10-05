const SpotifyWebApi = require("spotify-web-api-node");

module.exports = sqlConnection => {
  const spotifyApi = new SpotifyWebApi();

  const sql = "SELECT * FROM `variables` WHERE `name` = 'access_token'";
  sqlConnection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(`Load Access Token: ${JSON.stringify(result[0].key)}`);
    spotifyApi.setAccessToken(result[0].key);
  });
  
  return spotifyApi;
};
