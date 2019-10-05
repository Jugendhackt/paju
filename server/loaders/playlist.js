/* eslint-disable no-undef */
/* eslint-disable no-negated-condition */
const bodyParser = require("body-parser");
const { Router } = require("express");
const _ = require("lodash");

module.exports = ({ db, app, spotifyApi }) => {
  const R = new Router();

  R.use(bodyParser.json());

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
