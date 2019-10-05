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
          {{ failed ? "An error occurred" : "Login" }}
        </v-card-title>
        <v-card-text>
          {{ failed ? "Please try again." : "Please login to use Paju." }}
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn href="/auth/redirect" color="primary">
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
      failed() {
        return this.$route.query.failed === "1";
      }
    }
  };
</script>
