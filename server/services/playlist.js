/* eslint-disable no-negated-condition */
const consola = require("consola");

module.exports = class PlaylistService {
  constructor(spotifyApi, sqlConnection) {
    this.api = spotifyApi;
    this.con = sqlConnection;
  }

  async searchTracks(name, amouth = 10) {
    const output = await this.api.searchTracks(name);
    return output.body.tracks.items.slice(0, amouth);
  }

  async listSongs() {
    const sql = "SELECT * FROM `playlist` ";
    const data = await this.con.query(sql);
    return data;
  }

  async removeSong(spotifyId, userIp = "0.0.0.0") {
    const sql = `DELETE FROM \`playlist\` WHERE \`playlist\`.\`spotify_id\` = ${spotifyId}`;
    const data = await this.con.query(sql);

    consola.info("[myqsl]", `${userIp}: Song "${spotifyId}" removed from Playlist`);
    return data;
  }

  async addSong(spotifyId, userIp = "0.0.0.0") {
    const sqlFind = `SELECT * FROM \`playlist\` WHERE \`spotify_id\` = '${spotifyId}'`;
    await this.con.query(sqlFind, (err, res) => {
      if (err) {
        throw err;
      }

      if (!res.length) {
        const sqlAdd = `INSERT INTO \`playlist\` (\`id\`, \`spotify_id\`, \`user_ip\`, \`date_added\`) VALUES (NULL, '${spotifyId}', '${userIp}', CURRENT_TIMESTAMP);`;
        this.con.query(sqlAdd, (err, res) => {
          if (err) {
            throw err;
          }
        });

        consola.info("[myqsl]", `${userIp}: Song "${spotifyId}" added to Playlist`);
      } else {
        consola.info("[myqsl]", `${userIp}: Song "${spotifyId}" already in Playlist`);
      }
    });
  }
};
