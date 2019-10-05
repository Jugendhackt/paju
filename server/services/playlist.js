module.exports = class PlaylistService {
  constructor(spotifyApi) {
    this.api = spotifyApi;
  }
  searchTrack(songName) {
    // Search tracks whose name, album or artist contains 'Love'
    this.api.searchTracks(songName)
      .then(data => {
        console.log("Search by \"Love\"", data.body);
      }, err => {
        console.error(err);
      });
  }
};
