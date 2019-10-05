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
          Login
        </v-card-title>
        <v-card-text>
          Please login to use Paju.
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn :href="authorizeURL" color="primary">
            Login with Spotify
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    computed: {
      authorizeURL() {
        return "https://accounts.spotify.com/authorize?";
      }
    }
  };
</script>
