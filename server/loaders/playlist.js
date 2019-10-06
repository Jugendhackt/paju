const bodyParser = require("body-parser");
const { Router } = require("express");
const _ = require("lodash");

const COOLDOWN = 50000;

const userList = [{
  ip: "0.0.0.0",
  time: 0
}];

module.exports = ({
  db,
  app,
  spotifyApi
}) => {
  const R = new Router();

  R.use(bodyParser.json());

  let saved = [];
  setTimeout(async () => {
    saved = (await spotifyApi.getPlaylistTracks(process.env.PLAYLIST_ID, {
      limit: 100,
      fields: "items(track(id))"
    })).body.items.map(item => item.track.id);
  }, 10 * 1000);

  R.get("/", async (req, res) => {
    const playlist = await spotifyApi.getPlaylistTracks(process.env.PLAYLIST_ID, {
      limit: 100,
      fields: "items(track(name,id,artists(name)))"
    });

    res.send(playlist.body.items.map(({ track }) => ({
      title: track.name,
      id: track.id,
      artists: _.map(track.artists, "name")
    })));
  });

  R.get("/delete", async (req, res) => {
    try {
      await spotifyApi.removeTracksFromPlaylistByPosition(
        process.env.PLAYLIST_ID,
        [req.query.index]
      );

      res.status(204).send();
      res.send("ok");
    } catch (e) {
      res.status(e.statusCode).send();
      console.error(e);
      res.send(e);
    }
  });

  R.get("/search", async (req, res) => {
    const result = await spotifyApi.searchTracks(req.query.q, {
      fields: "items(track(name,id,artists(name)))"
    });

    res.send(result.body.tracks.items.map(track => ({
      title: track.name,
      id: track.id,
      artists: _.map(track.artists, "name"),
      saved: saved.includes(track.id)
    })));
  });

  R.put("/", async (req, res) => {
    try {
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        const susUsers = userList.find(user => (user.ip === ip)) || 0;
        if (susUsers) {
          const timeGone = Date.now() - susUsers.time;
          console.log(timeGone);

          if (timeGone < COOLDOWN) {
            res.status(429).send({
              error: "TIMEOUT",
              timeLeft: COOLDOWN - timeGone
            });

            return;
          }
        }

        userList.push({
          ip,
          time: Date.now()
        });

        console.log(userList);

        await spotifyApi.addTracksToPlaylist(
          process.env.PLAYLIST_ID,
          [`spotify:track:${req.body.id}`]
        );
        saved.push(req.body.id);

        res.status(204).send();
    } catch (e) {
      console.error(e);
    }
  });

  app.use("/api/playlist", R);
};
