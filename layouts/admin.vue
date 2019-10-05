<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawerOpen"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="false"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawerOpen = !drawerOpen"></v-app-bar-nav-icon>
      <v-toolbar-title>Paju</v-toolbar-title>
      <v-spacer/>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  /* eslint-disable no-undef */
  window.onSpotifyWebPlaybackSDKReady = () => {
    // eslint-disable-next-line no-new
    const player = new Spotify.Player({
      name: "Paju",
      getOAuthToken: async callback => {
        // eslint-disable-next-line standard/no-callback-literal
        callback((await $nuxt.$axios.$get("/auth/token")).token);
      },
      volume: 1
    });

    player.connect();
  };

  export default {
    data: () => ({
      drawerOpen: null,
      items: [
        {
          icon: "dashboard",
          title: "Dashboard",
          to: "/dashboard"
        },
        {
          icon: "playlist_play",
          title: "Playlist",
          to: "/tracklist"
        },
        {
          icon: "search",
          title: "Search",
          to: "/g/search"
        }
      ]
    }),
    mounted() {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      document.body.append(script);

      this.$on("hook:beforeDestroy", () => {
        document.body.removeChild(script);
      });
    }
  };
</script>
