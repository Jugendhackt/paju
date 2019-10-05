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
        class="playlist-table elevation-1"
        disable-sort
        fixed-header
        disable-pagination
        hide-default-footer
        :mobile-breakpoint="0"
        :headers="headers"
        :items="tracks"
      >
        <template v-slot:item.add="{ item }">
          <template v-if="item.saved">
            <v-btn icon text disabled>
              <v-icon>check</v-icon>
            </v-btn>
          </template>
          <template v-else>
            <v-btn icon text @click="add(item)">
              <v-icon>add_circle_outline</v-icon>
            </v-btn>
          </template>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<style scoped lang="scss">
  .playlist-table {
    width: 1000px;
    max-width: 100%;
  }
</style>

<script>
  import debounce from "lodash.debounce";

  export default {
    data: () => ({
      headers: [
        { text: "", value: "add" },
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
      add(item) {
        item.saved = true;

        this.$axios.$put("/playlist", {
          id: item.id
        });
      }
    }
  };
</script>
