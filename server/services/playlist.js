module.exports = class PlaylistService {
  constructor(spotifyApi) {
    this.api = spotifyApi;
  }
  async searchTracks(songName) {
    // Search tracks whose name, album or artist contains 'Love'
    const data = await this.api.searchTracks(songName);
    return data;
  }
};
