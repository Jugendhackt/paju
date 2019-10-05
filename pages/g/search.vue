<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <input type="text" v-model="search" placeholder="edit me" />
      <v-data-table
        disable-sort
        fixed-header
        :headers="headers"
        :items="songs"
        :items-per-page="5"
        class="elevation-1"
      ></v-data-table>
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
      { text: "Artist", value: "artist" }
    ],
    songs: [],
    search: ""
  }),
  async asyncData({ $axios }) {
    return {
      songs: await $axios.$post("/tracklist/searchTracks", {
        name: "Take on Me",
        amount: 3
      })
    };
  }
};
</script>
