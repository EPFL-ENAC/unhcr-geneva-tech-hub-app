<template>
  <v-container fluid v-if="localProject.users">
    <v-form
      :readonly="!$can('edit', localProject)"
      @submit.prevent="() => submitForm(localProject)"
    >
      <v-row>
        <v-col>
          <h2 class="text-h4 project-shelter__h3 font-weight-medium">
            WASH - TRUCKING
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="6">
          <v-row>
            <v-col :cols="12">
              <v-card flat>
                <v-card-title><h2>Baseline</h2></v-card-title>
                <v-card-text>
                  <div v-for="washInput in washInputs" :key="washInput.code">
                    <v-text-field
                      v-if="washInput.type === 'number'"
                      v-model.number="washForm.baseline[washInput.code]"
                      min="1"
                      max="100"
                      :label="washInput.description"
                      type="number"
                      :disabled="washInput.disabled"
                      suffix="%"
                    ></v-text-field>
                    <v-select
                      v-if="washInput.type === 'select'"
                      v-model="washForm.baseline[washInput.code]"
                      :items="washInput.items"
                      :label="washInput.description"
                      :disabled="washInput.disabled"
                    >
                    </v-select>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col :cols="12">
              <v-card flat>
                <v-card-title><h2>Results</h2></v-card-title>
                <v-card-text> </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col :cols="6">
          <v-row>
            <v-col :cols="12">
              <v-card flat>
                <v-card-title><h2>Endline</h2></v-card-title>
                <v-card-text>
                  <div v-for="washInput in washInputs" :key="washInput.code">
                    <v-text-field
                      v-if="washInput.type === 'number'"
                      v-model.number="washForm.endline[washInput.code]"
                      min="1"
                      max="100"
                      :label="washInput.description"
                      type="number"
                      :disabled="washInput.disabled"
                      suffix="%"
                    ></v-text-field>
                    <v-select
                      v-if="washInput.type === 'select'"
                      v-model="washForm.endline[washInput.code]"
                      :items="washInput.items"
                      :label="washInput.description"
                      :disabled="washInput.disabled"
                    >
                    </v-select>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col :cols="12">
              <v-card flat>
                <v-card-title><h2>Results</h2></v-card-title>
                <v-card-text> </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
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
})
export default class WASH extends Vue {
  project!: GreenHouseGaz;
  localProject = {} as GreenHouseGaz;

  washForm = {
    baseline: {
      US_TYP_B: "WATER",
      TOT_WS_B: 10000,
      WACL_B: 5,
      TR_VOL_B: 2.5,
      TR_TYP_B: "DIESEL",
    },
    endline: {
      US_TYP_B: "WATER",
      TOT_WS_B: 10000,
      WACL_B: 5,
      TR_VOL_B: 2,
      TR_TYP_B: "DIESEL",
    },
  };
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
  // B is for Baseline
  // E is for endline
  readonly washInputs = [
    {
      description: "Trucking type",
      code: "US_TYP_B",
      type: "select",
      items: ["WATER", "WASTEWATER", "FAECAL SLUDGE"],
    },
    {
      description: "Distance between camp and water source",
      code: "TOT_WS_B",
      type: "number",
      default: 10000,
    },
    {
      description: "Total volume of water collected (m3)",
      code: "WACL_B",
      type: "number",
    },
    {
      description: "Volume of one water truck",
      code: "TR_VOL_B",
      type: "number",
    },
    {
      description: "Type of truck",
      code: "TR_TYP_B",
      type: "select",
      items: ["DIESEL"],
    },
  ];
}
</script>

<style></style>
