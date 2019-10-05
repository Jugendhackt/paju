<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-list v-if="tracks.length !== 0" class="first-song" elevation="5">
        <v-list-item two-line ripple>
          <v-list-item-icon class="song--icon-wrapper">
            <v-icon size="2rem">
              mdi-play
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ tracks[0].title }}</v-list-item-title>
            <v-list-item-subtitle>{{ tracks[0].artists.join(", ") }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list v-if="tracks.length > 1" elevation="2">
        <v-list-item v-for="track in tracks.slice(1)" :key="track.id" two-line ripple>
          <v-list-item-content>
            <v-list-item-title>{{ track.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ track.artists.join(", ") }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-btn text @click="remove(track.id)">
            <v-list-item-icon class="song--icon-wrapper">
              <v-icon size="1.5rem">
                mdi-delete
              </v-icon>
            </v-list-item-icon>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<style scoped lang="scss">
.first-song {
  margin-bottom: 20px;
}

.song--icon-wrapper:first-child {
  margin-right: 10px;
  margin-bottom: 0;
}
</style>

<script>
  export default {
    data: () => ({
      headers: [
        { text: "Title", value: "name" },
        { text: "Artist", value: "artist" },
        { text: "Added by", value: "addedBy" }
      ],
      tracks: []
    }),
    async asyncData({ $axios }) {
      return {
        tracks: await $axios.$get("/playlist")
      };
    },
    methods: {
      remove(id) {
        const index = this.tracks.findIndex(track => track.id === id);
        this.$axios.$get(`/playlist/delete?index=${index}`);
      }
    }
  };
</script>
