<template>
  <v-container>
    <v-row v-if="$userIs('LoggedOut')">
      <v-col>
        <v-alert type="warning"> You are not logged in </v-alert>
      </v-col>
    </v-row>
    <v-row v-if="$userIs('LoggedIn')">
      <v-col v-for="app in Apps" :key="app.title">
        <v-hover v-slot="{ hover }">
          <v-card
            class="mx-auto d-flex flex-column"
            outlined
            min-height="300px"
            max-width="100%"
            :elevation="hover ? 12 : 2"
            :class="{ 'on-hover': hover }"
            :to="{ name: app.to }"
          >
            <v-list-item three-line>
              <v-list-item-content>
                <div class="text-overline mb-4">UNHCR</div>
                <v-list-item-title class="text-h5 mb-1">
                  {{ app.title }}
                </v-list-item-title>
                <div class="description">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <p v-if="app.description" v-html="app.description" />
                  <component
                    :is="app.descriptionComponent"
                    v-if="app.descriptionComponent"
                    :app="app"
                  />
                </div>
                <div>
                  last updated: {{ app.lastUpdated }}
                </div>
                <div class="item-btn-container">
                  <v-btn
                    v-if="app.link"
                    outlined
                    rounded
                    text
                    :href="app.link"
                    target="_blank"
                    @click.stop=""
                  >
                    Click here for access to the Guidance Manual
                  </v-btn>
                </div>
              </v-list-item-content>

              <div class="icon-and-click">
                <v-list-item-avatar tile size="80">
                  <v-img v-if="app.logoImg" :src="app.logoImg"></v-img>
                  <v-icon v-if="app.logoIcon" color="black" x-large>
                    {{ app.logoIcon }}
                  </v-icon>
                </v-list-item-avatar>
                <v-card-actions class="app-action">
                  <v-btn outlined rounded text :to="{ name: app.to }">
                    Access
                  </v-btn>
                </v-card-actions>
              </div>
            </v-list-item>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import GhgDescription from "@/components/GhgDescription.vue";
import Apps from "@/utils/apps";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    GhgDescription,
  },
})
export default class AppList extends Vue {
  Apps = Apps;
}
</script>

<style lang="scss" scoped>
.v-card {
  transition: opacity 0.2s ease-in-out;
  cursor: pointer;
}
.icon-and-click {
  flex-direction: column;
  align-self: stretch;
  display: flex;
  flex-wrap: wrap;
  flex: 0 1 auto;
  overflow: hidden;
  padding: 12px 0;
  justify-content: space-between;
  div {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
::v-deep .v-card__actions.app-action {
  width: 80px; // like the logo app
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
}

.description {
  overflow: auto;
  height: 200px;
}
.item-btn-container {
  padding-top: 8px;
  padding-bottom: 8px;
}
</style>
