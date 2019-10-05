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
      <div class="text-center">
        <img src="/paju.png" alt="Paju">
      </div>
      <v-card>
        <v-card-title class="headline">
          Almost done...
        </v-card-title>
        <v-card-text>
          To start playing music, please open the Spotify player on one of your devices.
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn href="https://open.spotify.com" target="_blank" color="primary">
            Open the Player
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<style scoped lang="scss">

</style>

<script>
  export default {
    layout: "admin",
    middleware: ["auth"]
  };
</script>
