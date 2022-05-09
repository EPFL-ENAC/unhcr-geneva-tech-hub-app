<template>
  <main class="error-view d-flex space-between">
    <v-card class="about ma-4" elevation="2">
      <v-card-title>
        <h2 class="mx-8">Error</h2>
      </v-card-title>
      <v-card-text>
        <p class="mx-10">
          This Web Application is under active development. <br />
          You're on the error page due to this message: <br />
          <v-divider class="my-4" />
          <v-alert shaped text type="error"> {{ error }}</v-alert>
        </p>
      </v-card-text>
    </v-card>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("UserModule", ["user"]),
    ...mapGetters(["error"]),
  },
})
/** ErrorView */
export default class ErrorView extends Vue {}
</script>

<style lang="scss" scoped>
.error-view {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1 0 auto;
  height: 100%;
}
</style>
