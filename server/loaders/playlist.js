const bodyParser = require("body-parser");
const { Router } = require("express");
const _ = require("lodash");

const COOLDOWN = 50000;

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

  let lastTrackID = null;

  R.get("/", async (req, res) => {
    const currentPlayingTrack = (await spotifyApi.getMyCurrentPlayingTrack({
      fields: "item(id)"
    })).body.item;

    if (currentPlayingTrack) {
      if (currentPlayingTrack.id !== lastTrackID) {
        const snapshotId = (await spotifyApi.getPlaylist(process.env.PLAYLIST_ID, {
          fields: "snapshot_id"
        })).body.snapshot_id;

        await spotifyApi.removeTracksFromPlaylistByPosition(
          process.env.PLAYLIST_ID,
          [0],
          snapshotId
        );
      }

      lastTrackID = currentPlayingTrack.id;
    }

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

  R.delete("/:id", async (req, res) => {
    try {
      const snapshotId = (await spotifyApi.getPlaylist(process.env.PLAYLIST_ID, {
        fields: "snapshot_id"
      })).body.snapshot_id;

      await spotifyApi.removeTracksFromPlaylist(
        process.env.PLAYLIST_ID,
        [{ uri: `spotify:track:${req.params.id}` }],
        snapshotId
      );

      saved.splice(saved.indexOf(req.params.id), 1);

      res.status(204).send();
    } catch (e) {
      console.error(e);
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

  const users = {};

  R.put("/", async (req, res) => {
    try {
      const ip = req.connection.remoteAddress;

      if (Date.now() - users[ip] < COOLDOWN) {
        res.status(429).send({
          error: "TIMEOUT"
        });

        return;
      }

      users[ip] = Date.now();
      console.log(users);

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
