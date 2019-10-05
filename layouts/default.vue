<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawerOpen"
      mini-variant
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
  export default {
    data: () => ({
      drawerOpen: null,
      items: [
        {
          icon: "dashboard",
          title: "Dashboard",
          to: "/"
        },
        {
          icon: "playlist_play",
          title: "Playlist",
          to: "/playlist"
        }
      ]
    })
  };
</script>
