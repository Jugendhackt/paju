<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-text-field
        v-model="search"
        type="search"
        autocomplete="off"
        label="Search"
        outlined
      ></v-text-field>
      <v-data-table
        disable-sort
        fixed-header
        :headers="headers"
        :items="tracks"
        :items-per-page="20"
        class="elevation-1"
      >
        <template v-slot:item.add="{ item }">
          <v-btn text @click="add(item.id)">
            Add
          </v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<style scoped lang="scss">

</style>

<script>
  import debounce from "lodash.debounce";

  export default {
    data: () => ({
      headers: [
        { text: "Add", value: "add" },
        { text: "Title", value: "title" },
        { text: "Artist", value: "artist" }
      ],
      tracks: [],
      search: ""
    }),
    watch: {
      search: debounce(async function() {
        this.tracks = (await this.$axios.$get(`/playlist/search?q=${encodeURIComponent(this.search)}`)).map(track => ({
          ...track,
          artist: track.artists.join(", ")
        }), 500, {
          trailing: true
        });
      })
    },
    methods: {
      add(id) {
        this.$axios.$put("/playlist", {
          id
        });
      }
    }
  };
</script>
