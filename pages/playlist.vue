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
        <v-list-item v-for="(track, index) in tracks.slice(1)" :key="track.id" two-line ripple>
          <v-list-item-content>
            <v-list-item-title>{{ track.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ track.artists.join(", ") }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="remove(index)">
              <v-icon size="1.5rem">
                delete
              </v-icon>
            </v-btn>
          </v-list-item-action>
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
    layout: "admin",
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
      remove(index) {
        const track = this.tracks[index + 1];
        this.$axios.$delete(`/playlist/${track.id}`);
        this.tracks.splice(index + 1, 1);
      }
    }
  };
</script>
