<template>
  <v-data-table
    disable-sort
    fixed-header
    :headers="headers"
    :items="items"
    :items-per-page="5"
    class="elevation-1"
  ></v-data-table>
</template>

<style scoped lang="scss">

</style>

<script>
  export default {
    data: () => ({
      headers: [
        { text: "Title", value: "title" },
        { text: "Artist", value: "artist" },
        { text: "Added by", value: "addedBy" }
      ],
      items: []
    }),
    async asyncData({ $axios }) {
      return {
        items: [
          {
            id: "4Nip6oiJU24LqcUEi7u19S",
            title: "Standard (feat. Trettmann, Gringo, Ufo361 & Gzuz)",
            artist: "Kitschkrieg, Trettmann, Gzuz, Gringo, Ufo361",
            addedBy: "Moritz"
          }
        ]
      };

      // return {
      //   items: await $axios.$get("/playlist")
      // };
    }
  };
</script>
