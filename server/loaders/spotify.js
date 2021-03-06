const querystring = require("querystring");
const consola = require("consola");
const SpotifyWebApi = require("spotify-web-api-node");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const nanoid = require("nanoid");
const request = require("request"); // "Request" library
const { Router } = require("express");

const REDIRECT_URI = "http://localhost:3000/api/auth/callback";
const STATE_COOKIE_NAME = "spotify_auth_state";
const SCOPE = [
  "streaming",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-email",
  "user-read-private",
  "playlist-modify-private",
  "playlist-modify-public",
  "playlist-read-private"
].join(" ");

const clientID = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

module.exports = context => {
  const { db, app } = context;

  const spotifyApi = new SpotifyWebApi({
    client_id: clientID,
    client_secret: clientSecret,
    redirect_uri: REDIRECT_URI
  });

  context.spotifyApi = spotifyApi;

  (() => {
    const sql = "SELECT * FROM `variables` WHERE `name` = 'access_token'";

    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        context.spotifyAccessToken = result[0].value;
        spotifyApi.setAccessToken(context.spotifyAccessToken);
      }
    });
  })();

  const R = new Router();

  R.use(cors());
  R.use(cookieParser());

  R.get("/redirect", (req, res) => {
    const state = nanoid(16);

    res.cookie(STATE_COOKIE_NAME, state, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 5 * 60 * 1000, // 5 minutes
      sameSite: "strict"
    });

    res.redirect(`https://accounts.spotify.com/authorize?${
      querystring.stringify({
        response_type: "code",
        client_id: clientID,
        scope: SCOPE,
        redirect_uri: REDIRECT_URI,
        state
      })}`);
  });

  R.get("/callback", (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[STATE_COOKIE_NAME] : null;

    if (state === null || state !== storedState) {
      consola.error("auth: STATE_MISMATCH");
      res.redirect("/?failed=1");
    } else {
      res.clearCookie(STATE_COOKIE_NAME);

      const authOptions = {
        url: "https://accounts.spotify.com/api/token",
        form: {
          code,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code"
        },
        headers: {
          Authorization: `Basic ${Buffer.from(`${clientID}:${clientSecret}`).toString("base64")}`
        },
        json: true
      };

      request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const { access_token: accessToken } = body;

          const sql =
            `UPDATE \`variables\` SET \`value\` = '${accessToken}' WHERE \`variables\`.\`name\` = 'access_token'`;

          db.query(sql, err => {
            if (err) {
              throw err;
            }
          });

          context.spotifyAccessToken = accessToken;
          spotifyApi.setAccessToken(accessToken);

          res.redirect("/dashboard");
        } else {
          res.redirect("/?failed=1");
        }
      });
    }
  });

  R.get("/token", (req, res) => {
    const sql = "SELECT * FROM `variables` WHERE `variables`.`name` = 'access_token'";

    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      }

      res.send({
        token: result[0] ? result[0].value : null
      });
    });
  });

  app.use("/api/auth", R);
  context.spotifyApi = spotifyApi;
};
