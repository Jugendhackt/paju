/* eslint-disable no-undef */
/* eslint-disable no-negated-condition */
const consola = require("consola");
const {
  Router
} = require("express");

module.exports = (spotifyApi, sqlConnection, app) => {
  const R = new Router();

  R.get("/track", async (req, res) => {
    const spotifyId = req.query.id || null;
    const output = await spotifyApi.getTrack(spotifyId);

    res.send(output.body);
  });

  R.post("/searchTracks", async (req, res) => {
    const name = req.query.name || null;
    const amouth = req.query.amouth || 10;

    const output = await spotifyApi.searchTracks(name);
    res.send(output.body.tracks.items.slice(0, amouth));
  });

  R.get("/", async (req, res) => {
    const sql = "SELECT * FROM `playlist` ";
    await sqlConnection.query(sql, async (err, resSql) => {
      if (err) {
        throw err;
      }

      const tracks = resSql.map(async track => {
        const id = track.spotify_id.substring(14);
        const trackInfo = await spotifyApi.getTrack(id).catch(err => {
          console.error(err);
        });
        track.name = trackInfo.body.name;
        track.artists = "";
        trackInfo.body.artists.forEach(artist => {
          track.artists += `${artist.name} `;
        });
        sqlConnection.query(`SELECT * FROM \`users\` WHERE \`adress\` = '${track.user_ip}'`, (err, res) => {
          if (err) {
            console.error(err);
          }
          track.addedBy = res;
        });

        // console.log(track);
      });
      console.log( await )
      res.send(await Promise.all(tracks));
    });
  });

  R.delete("/", async (req, res) => {
    const spotifyId = req.query.id || null;
    const userIp = req.query.ip || "0.0.0.0";

    const sql = `DELETE FROM \`playlist\` WHERE \`playlist\`.\`spotify_id\` = ${spotifyId}`;
    await sqlConnection.query(sql, (err, resSql) => {
      if (err) {
        throw err;
      }
      consola.info("[myqsl]", `${userIp}: Song "${spotifyId}" removed from Playlist`);
      res.send(resSql);
    });
  });

  R.put("/", async (req, res) => {
    const spotifyId = req.query.id || null;
    const userIp = req.query.ip || "0.0.0.0";

    const sqlFind = `SELECT * FROM \`playlist\` WHERE \`spotify_id\` = '${spotifyId}'`;
    await sqlConnection.query(sqlFind, (err, resFind) => {
      if (err) {
        throw err;
      }

      if (!res.length) {
        const sqlAdd = `INSERT INTO \`playlist\` (\`id\`, \`spotify_id\`, \`user_ip\`, \`date_added\`) VALUES (NULL, '${spotifyId}', '${userIp}', CURRENT_TIMESTAMP);`;
        sqlConnection.query(sqlAdd, (err, resAdd) => {
          if (err) {
            throw err;
          }
        });

        consola.info("[myqsl]", `${userIp}: Song "${spotifyId}" added to Playlist`);
        res.send(true);
      } else {
        consola.info("[myqsl]", `${userIp}: Song "${spotifyId}" already in Playlist`);
      }
    });
  });

  app.use("/tracklist", R);
};
