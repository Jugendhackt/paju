/* eslint-disable no-undef */
/* eslint-disable no-negated-condition */
const bodyParser = require("body-parser");
const { Router } = require("express");
const _ = require("lodash");

module.exports = context => {
  const { app, spotifyApi } = context;

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

  let saved = [];
  setTimeout(async () => {
    saved = (await spotifyApi.getPlaylistTracks(process.env.PLAYLIST_ID, {
      limit: 100,
      fields: "items(track(id))"
    })).body.items.map(({ track }) => track.id);
  }, 10000);

  R.get("/search", async (req, res) => {
    const result = await spotifyApi.searchTracks(req.query.q, {
      fields: "tracks(items(name,id,artists(name)))"
    });

    res.send(result.body.tracks.items.map(track => ({
      title: track.name,
      id: track.id,
      artists: _.map(track.artists, "name"),
      saved: saved.includes(track.id)
    })));
  });

  R.put("/", async (req, res) => {
    if (saved.includes(req.body.id)) {
      res.status(402).send({
        error: "ALREADY_INSIDE"
      });
      return;
    }

    saved.push(req.body.id);

    await spotifyApi.addTracksToPlaylist(
      process.env.PLAYLIST_ID,
      [`spotify:track:${req.body.id}`]
    );

    res.status(204).send();
  });

  app.use("/api/playlist", R);
};
