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
        { text: "Title", value: "name" },
        { text: "Artist", value: "artists" },
        { text: "Added by", value: "addedBy" }
      ],
      items: []
    }),
    async asyncData({ $axios }) {
      return {
        items: await $axios.$get("/tracklist")
      };
    }
  };
</script>
