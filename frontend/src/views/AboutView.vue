<template>
  <main class="about-view">
    <v-card class="about ma-4" elevation="2">
      <v-card-text>
        <h2 class="mx-8">Disclaimer</h2>
        <p class="mx-10">
          This Web Application is under active development. The current version
          is only available as a proff of concept. Please report any bugs
          <a
            href="https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues"
            >here</a
          >
        </p>
      </v-card-text>
      <v-divider />
      <v-card-text>
        <p class="mx-10">
          In the context of ongoing work with UNHCR Geneva Technical Hub,
          EssentialTech, FAR and BPE aim to develop web application building on
          various data sources (mostly Excel sheets and web source) and user
          inputs, to improve sustainability practices, through GHG emmissions
          estimates, shleter sustainability scores and improved energy planning
          in refugee camps. The overaching project is composed of 3 different
          tools, each with distinct specifications and functionalities - but
          developed jointly to foster synergies and integration wherever
          possible.
        </p>
        <p class="mx-10">
          The proposed tools will enable UNHCR to address its goal of 'greening'
          its operations and will support UNHCR to respond to Objective 3 of its
          Strategic Framework for Climate Action: *Objective 3: Improve UNHCR's
          environmental sustainability by reducing greenhouse gas emissions and
          minimizing negative impacts on the environment.*
        </p>

        <p class="mx-10">
          Through UNHCR's Global Strategy for Sustainable Energy 2019-2024,
          UNHCR is undertaking ambitious action to avoid or reduce negative
          environmental impacts. Over 90 percent of refugees living in
          settlements have no access to electricity or clean sources of energy.
          Sustainable energy solutions benefit both displaced and host
          countries' national and local energy plans in line with SDG 7 on
          ensuring access to affordable, reliable, sustainable and modern energy
          for all.
        </p>
      </v-card-text>
      <v-card-text>
        <v-simple-table class="ma-8">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Tool Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(app, $key) in Apps" :key="$key">
                <td>{{ app.title }}</td>
                <td>
                  {{ app.description }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <app-logo />
  </main>
</template>

<script lang="ts">
import AppLogo from "@/components/commons/AppLogo.vue";
import Apps from "@/utils/apps";
import Vue from "vue";

export default Vue.extend({
  name: "AboutView",
  data() {
    return {
      Apps,
    };
  },
  components: {
    AppLogo,
  },
});
</script>

<style lang="scss" scoped>
.about-view {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1 0 auto;
  height: 100%;
}
</style>
