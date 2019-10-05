<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <v-list
        v-if="songs.length !== 0"
        class="first-song"
        elevation="5"
      >
        <v-list-item
          two-line
          ripple
        >
          <v-list-item-icon class="song--icon-wrapper">
            <v-icon size="2rem">
              mdi-play
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ songs[0].title }}</v-list-item-title>
            <v-list-item-subtitle>{{ songs[0].artist }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list
        elevation="2"
      >
        <v-list-item
          v-for="song in songs.slice(1)"
          :key="song.id"
          two-line
          ripple
        >
          <v-list-item-content>
            <v-list-item-title>{{ song.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ song.artist }}</v-list-item-subtitle>
          </v-list-item-content>
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
        { text: "Title", value: "title" },
        { text: "Artist", value: "artist" },
        { text: "Added by", value: "addedBy" }
      ],
      songs: []
    }),
    async asyncData({ $axios }) {
      return {
        songs: [
          {
            id: "4Nip6oiJU24LqcUEi7u19S",
            title: "Standard (feat. Trettmann, Gringo, Ufo361 & Gzuz)",
            artist: "Kitschkrieg, Trettmann, Gzuz, Gringo, Ufo361",
            addedBy: "Moritz"
          },
          {
            id: "4Nip6oiJU24LqcUEi7u19a",
            title: "Standard (feat. Trettmann, Gringo, Ufo361 & Gzuz)",
            artist: "Kitschkrieg, Trettmann, Gzuz, Gringo, Ufo361",
            addedBy: "Moritz"
          },
          {
            id: "4Nip6oiJU24LqcUEi7u198",
            title: "Standard (feat. Trettmann, Gringo, Ufo361 & Gzuz)",
            artist: "Kitschkrieg, Trettmann, Gzuz, Gringo, Ufo361",
            addedBy: "Moritz"
          }
        ]
      };

      // return {
      //   songs: await $axios.$get("/playlist")
      // };
    }
  };
</script>
