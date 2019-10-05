/* eslint-disable no-undef */
/* eslint-disable no-negated-condition */
const bodyParser = require("body-parser");
const consola = require("consola");
const {
  Router
} = require("express");

module.exports = ({
  db,
  app,
  spotifyApi
}) => {
  const R = new Router();

  R.use(bodyParser.json());

  R.get("/track", async (req, res) => {
    const spotifyId = req.query.id || null;
    const output = await spotifyApi.getTrack(spotifyId).catch(err => {
      consola.error(err);
    });

    res.send(output.body);
  });

  R.post("/searchTracks", async (req, res) => {
    const name = req.body.name || null;
    const amount = req.body.amount || 10;

    const output = await spotifyApi.searchTracks(name)

    const tracks = output.body.tracks.items.slice(0, amount);
    const tracksNew = tracks.map(track => {
      track.artist = "";
      track.artists.forEach(artist => {
        track.artist += `${artist.name} `;
      });
      return track;
    });
    res.send(tracksNew);
  });

  R.get("/", async (req, res) => {
    const sql = "SELECT * FROM `playlist` ";
    await db.query(sql, async (err, resSql) => {
      if (err) {
        throw err;
      }

      for (let i = 0; i < resSql.length; i += 1) {
        const track = {
          name: "",
          artists: "",
          addedBy: ""
        };
        const id = resSql[i].spotify_id.substring(14);

        const trackInfo = await spotifyApi.getTrack(id).catch(err => {
          consola.error(err);
        });

        track.name = trackInfo.body.name;
        trackInfo.body.artists.forEach(artist => {
          track.artists += `${artist.name} `;
        });
        db.query(`SELECT * FROM \`users\` WHERE \`adress\` = '${resSql[i].user_ip}'`, (err, resSec) => {
          if (err) {
            consola.error(err);
          }
          track.addedBy = resSec[0].username;
        });

        resSql[i] = track;
      }
      res.send(resSql);
    });
  });

  R.delete("/", async (req, res) => {
    const spotifyId = req.query.id || null;
    const userIp = req.query.ip || "0.0.0.0";

    const sql = `DELETE FROM \`playlist\` WHERE \`playlist\`.\`spotify_id\` = ${spotifyId}`;
    await db.query(sql, (err, resSql) => {
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
    await db.query(sqlFind, (err, resFind) => {
      if (err) {
        throw err;
      }

      if (!res.length) {
        const sqlAdd = `INSERT INTO \`playlist\` (\`id\`, \`spotify_id\`, \`user_ip\`, \`date_added\`) VALUES (NULL, '${spotifyId}', '${userIp}', CURRENT_TIMESTAMP);`;
        db.query(sqlAdd, (err, resAdd) => {
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
