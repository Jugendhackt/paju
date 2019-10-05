/* eslint-disable camelcase */
const querystring = require("querystring");
const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express"); // Express web server framework
const cors = require("cors");
const cookieParser = require("cookie-parser");
const request = require("request"); // "Request" library

const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
const redirect_uri = "http://localhost:8888/callback/"; // Your redirect uri

const stateKey = "spotify_auth_state";

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function(length) {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

module.exports = (sqlConnection, app) => {
  const spotifyApi = new SpotifyWebApi({
    client_id,
    client_secret,
    redirect_uri
  });

  app.use(express.static(`${__dirname}/public`))
    .use(cors())
    .use(cookieParser());

  app.get("/", req => {
    if (req.query.access_token) {
      console.log(req.query.access_token);

      const sql = `UPDATE \`variables\` SET \`key\` = '${req.query.access_token}' WHERE \`variables\`.\`name\` = \`access_token\`;`;

      sqlConnection.query(sql, (err, result) => {
        if (err) {
          throw err;
        }
        console.debug(`Result: ${JSON.stringify(result)}`);
      });
    }
  });

  app.get("/login", (_req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    const scope = "user-read-private user-read-email";
    res.redirect(`https://accounts.spotify.com/authorize?${
      querystring.stringify({
        response_type: "code",
        client_id,
        scope,
        redirect_uri,
        state
      })}`);
  });

  app.get("/callback", (req, res) => {
    // your application requests refresh and access tokens
    // after checking the state parameter

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
      res.redirect(`/#${
        querystring.stringify({
          error: "state_mismatch"
        })}`);
    } else {
      res.clearCookie(stateKey);
      const authOptions = {
        url: "https://accounts.spotify.com/api/token",
        form: {
          code,
          redirect_uri,
          grant_type: "authorization_code"
        },
        headers: {
          Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString("base64")}`
        },
        json: true
      };

      request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const access_token = body.access_token;
            const refresh_token = body.refresh_token;

          const options = {
            url: "https://api.spotify.com/v1/me",
            headers: {
              Authorization: `Bearer ${access_token}`
            },
            json: true
          };

          // use the access token to access the Spotify Web API
          request.get(options, (_error, _response, body) => {
            console.log(body);
          });

          // we can also pass the token to the browser to make requests from there
          res.redirect(`/#${
            querystring.stringify({
              access_token,
              refresh_token
            })}`);
        } else {
          res.redirect(`/#${
            querystring.stringify({
              error: "invalid_token"
            })}`);
        }
      });
    }
  });

  app.get("/refresh_token", (req, res) => {
    // requesting access token from refresh token
    const refresh_token = req.query.refresh_token;
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString("base64")}`
      },
      form: {
        grant_type: "refresh_token",
        refresh_token
      },
      json: true
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token;
        res.send({
          access_token
        });
      }
    });
  });

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
