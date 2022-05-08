<template>
  <v-container v-if="localProject.users" fluid>
    <v-form
      :readonly="!$can('edit', localProject)"
      @submit.prevent="() => submitForm(localProject)"
    >
      <v-row>
        <v-col>
          <h2 class="text-h4 project-shelter__h3 font-weight-medium">
            Material - HH Waste
          </h2>
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="col-auto d-flex align-center">
          <info-tooltip>
            {{ infoTooltipText["Material-HHWaste"].text }}
          </info-tooltip>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          NOTE: This module of the Assessment Tool is under development
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
      <v-row v-if="$can('edit', localProject)">
        <v-col class="d-flex justify-end">
          <v-btn type="submit"> Save changes </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import { infoTooltipText } from "@/components/green_house_gaz/infoTooltipText";
import { GreenHouseGaz, Survey } from "@/store/GhgInterface";
import { cloneDeep } from "lodash";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgModule", ["project"]),
  },
  methods: {
    ...mapActions("GhgModule", ["getDoc", "updateDoc"]),
  },
  components: {
    InfoTooltip,
  },
})
export default class HHWaste extends Vue {
  project!: GreenHouseGaz;
  localProject = {} as GreenHouseGaz;
  infoTooltipText = infoTooltipText;

  configuration = {};
  localSurvey = {} as Survey;
  localSurveyIndex = -1;
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
