<template>
  <v-layout column justify-center align-center>
    <div class="autocomplete">
      <input type="text" v-model="search" v-on:submit.prevent="updateSearch" placeholder="edit me" />
      <ul class="autocomplete-results">
        <li class="autocomplete-result"></li>
      </ul>
    </div>
    <v-flex xs12 sm8 md6>
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

.autocomplete {
  position: relative;
  width: 130px;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  height: 120px;
  overflow: auto;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
}

.autocomplete-result:hover {
  background-color: #4aae9b;
  color: white;
}
</style>

<autocomplete :items="[ 'Standard', 'Affenbrotbaum', 'Orange', 'Mango', 'Pear', 'Peach', 'Grape', 'Tangerine', 'Pineapple']" />

<script>
export default {
  name: "autocomplete",
  methods: {
    async updateSearch() {
      this.tracks = await $axios.$post("/tracklist/searchTracks", {
        name: this.search,
        amount: 10
      })
    }
  },
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
      songs: this.tracks || [];
    };
  }
};
</script>
