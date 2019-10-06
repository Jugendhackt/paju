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
        class="elevation-1 search-table"
        disable-sort
        fixed-header
        hide-default-footer
        :mobile-breakpoint="0"
        :headers="headers"
        :items="tracks"
        :items-per-page="20"
      >
        <template v-slot:item.add="{ item }">
          <v-btn v-if="item.saved" icon text disabled>
            <v-icon>check</v-icon>
          </v-btn>
          <v-btn v-else icon text @click="add(item)">
            <v-icon>add_circle_outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-flex>
    <v-dialog
      v-model="timeoutDialogOpen"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline"
          primary-title
        >
          Cooldown
        </v-card-title>

        <v-card-text>
          Please wait a moment before submitting another track.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            color="primary"
            text
            @click="timeoutDialogOpen = false"
          >
            Okay
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<style scoped lang="scss">
  .search-table {
    width: 1000px;
    max-width: 100%;
  }
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
      search: "",
      timeoutDialogOpen: false
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
      async add(item) {
        try {
          await this.$axios.$put("/playlist", {
            id: item.id
          });

          item.saved = true;
        } catch (e) {
          this.timeoutDialogOpen = true;
        }
      }
    }
  };
</script>
