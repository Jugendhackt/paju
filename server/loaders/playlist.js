/* eslint-disable no-undef */
/* eslint-disable no-negated-condition */
const bodyParser = require("body-parser");
const {
  Router
} = require("express");
const _ = require("lodash");
const cooldown = 50000;
const userList = [{
  id: "0.0.0.0",
  time: 0
}];

module.exports = ({
  db,
  app,
  spotifyApi
}) => {
  const R = new Router();

  R.use(bodyParser.json());

  R.get("/", async (req, res) => {
    const playlist = await spotifyApi.getPlaylistTracks(process.env.PLAYLIST_ID, {
      limit: 100,
      fields: "items(track(name,id,artists(name)))"
    });

    res.send(playlist.body.items.map(({
      track
    }) => ({
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
      fields: "tracks(items)"
    });

    res.send(result.body.tracks.items.map(track => ({
      title: track.name,
      id: track.id,
      artists: _.map(track.artists, "name")
    })));
  });

  R.put("/", async (req, res) => {
    try {
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

      const susUsers = userList.find(user => (user.ip === ip)) || 0;
      if (susUsers) {
        const timeGone = Date.now() - susUsers.time;
        console.log(timeGone);
        if (timeGone < cooldown) {
          res.status(402).send({
            error: "TIMEOUT"
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

      res.status(204).send();
    } catch (e) {
      console.error(e);
    }
  });

  app.use("/playlist", R);
};
