<template>
  <v-layout column justify-center align-center>
    <v-list v-if="tracks.length !== 0" class="track__first track-list" elevation="5">
      <v-list-item two-line ripple>
        <v-list-item-icon class="track--icon-wrapper">
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

    <v-list v-if="tracks.length > 1" elevation="2" class="track-list">
      <v-list-item v-for="track in tracks.slice(1)" :key="track.id" two-line ripple>
        <v-list-item-content>
          <v-list-item-title>{{ track.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ track.artists.join(", ") }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-layout>
</template>

<style scoped lang="scss">
  .track__first {
    margin-bottom: 20px;
  }

  .track--icon-wrapper:first-child {
    margin-right: 10px;
    margin-bottom: 0;
  }

  .track-list {
    width: 500px;
    max-width: 100%;
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
    }
  };
</script>
