<template>
  <v-container v-if="localProject.users" fluid>
    <v-form
      v-model="formValid"
      :readonly="!$can('edit', localProject)"
      @submit.prevent="() => submitForm(localProject)"
    >
      <v-row>
        <v-col>
          <h2 class="text-h4 project__h3 font-weight-medium">
            WASH - Wastewater
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="4">
          <v-card flat>
            <v-card-title><h2>Inputs</h2></v-card-title>
            <v-card-text> </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="4">
          <v-card flat>
            <v-card-title><h2>Results</h2></v-card-title>
            <v-card-text> </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="4"></v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { GreenHouseGaz, Survey } from "@/store/GhgInterface.vue";
import { cloneDeep } from "lodash";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgModule", ["project"]),
    ...mapGetters("GhgReferenceModule", ["reference"]),
  },
  methods: {
    ...mapActions("GhgModule", ["getDoc", "updateDoc"]),
  },
})
export default class WasteWater extends Vue {
  project!: GreenHouseGaz;
  localProject = {} as GreenHouseGaz;

  configuration = {};
  localSurvey = {} as Survey;
  localSurveyIndex = -1;
  formValid = false;
  updateDoc!: (doc: GreenHouseGaz) => Promise<void>;

  public setLocalProject(): void {
    if (!this.project) {
      this.localProject = {} as GreenHouseGaz;
    } else {
      this.localProject = cloneDeep(this.project);
    }
  }

  public syncLocalProject(): void {
    // init function
    this.setLocalProject();

    this.$store.subscribe((mutation) => {
      const shouldUpdate = ["GhgModule/SET_PROJECT"];
      if (shouldUpdate.includes(mutation.type)) {
        this.setLocalProject();
      }
    });
  }

  public created(): void {
    this.syncLocalProject();
  }
}
</script>

<style></style>
