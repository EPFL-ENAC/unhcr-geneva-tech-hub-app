<template>
  <v-container v-if="this.shelter">
    <v-form @submit.prevent="() => submitForm(technical_performance)">
      <v-row>
        <v-col>
          <component
            :is="technicalPerformance.type"
            :form="technicalPerformance"
            :value="technical_performance"
            @input="(v) => update(v)"
          ></component>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn type="submit">Save changes</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import FormGroup from "@/components/shelter_sustainability/FormGroup.vue";
import { Score, Shelter } from "@/store/ShelterInterface";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapState } from "vuex";

@Component({
  components: {
    FormGroup,
  },
  computed: {
    ...mapState("ShelterItemModule", ["shelter"]),
  },
  methods: {
    ...mapActions("ShelterItemModule", ["updateDoc", "computeScore"]),
  },
})
/** Project */
export default class Step6 extends Vue {
  shelter!: Shelter;
  updateDoc!: (doc: Shelter) => void;
  computeScore!: (score: Score) => number;

  get technical_performance(): Score {
    return this.shelter.technical_performance;
  }
  public update(value: Score): void {
    this.shelter.technical_performance = value;
    this.shelter.technical_performance_score = this.computeScore(
      this.shelter.technical_performance
    );
    this.$store.commit("ShelterItemModule/SET_SHELTER", this.shelter);
  }

  public submitForm(value: Score): void {
    this.update(value);
    this.updateDoc(this.shelter);
  }

  technicalPerformance = {
    _id: "technical_performance",
    title: "Technical Performance",
    type: "formGroup",
    children: [
      {
        _id: "1_hazard",
        title: "Hazard-related structural performance",
        type: "formGroup",
        children: [
          {
            _id: "1a_wind_resistance",
            title: "Wind resistance",
            type: "checkboxGroup",
            inputs: [
              {
                _id: "input_1a_1",
                score: 1,
                label:
                  "Foundations and connections of wall structure to foundations designed to suit local lateral wind loads",
              },
              {
                _id: "input_1a_2",
                score: 1,
                label:
                  "Wall structure designed to suit local lateral wind loads, including incorporation of adequate bracing",
              },
              {
                _id: "input_1a_3",
                score: 1,
                label:
                  "Roof structure designed to suit local wind loads, including adequate connection between wall and roof structure to resist roof uplift",
              },
              {
                _id: "input_1a_4",
                score: 1,
                label:
                  "Roof cover designed to suit local wind loads, including adequate connection (nails, screws, etc.) of roofing materials to roof structure",
              },
            ],
          },
          {
            _id: "1b_flood_mitigation",
            title: "Flood mitigation",
            type: "checkboxGroup",
            inputs: [
              {
                _id: "input_1b_1",
                score: 1,
                label: "Floor level above forseeable flood level",
              },
              {
                _id: "input_1b_2",
                score: 1,
                label:
                  "Foundations designed to withstand uplift forces of saturated soil",
              },
              {
                _id: "input_1b_3",
                score: 1,
                label: "Door sills provided to minimise water ingress",
              },
              {
                _id: "input_1b_4",
                score: 1,
                label:
                  "Walls include stabilised materials at lower levels minimise flood-related erosion",
              },
              {
                _id: "input_1b_5",
                score: 1,
                label:
                  "Walls structure designed to suit lateral forces of surface adn flash flooding",
              },
            ],
          },
          {
            _id: "1c_seismic_resistance",
            title: "Seismic resistance",
            type: "checkboxGroup",
            inputs: [
              {
                _id: "input_1c_1",
                score: 1,
                label: "Wall openings positioned away from corners",
              },
              {
                _id: "input_1c_2",
                score: 1,
                label:
                  "Continuous ring beam provided along top of masonry wall",
              },
              {
                _id: "input_1c_3",
                score: 1,
                label:
                  "Door and window lintels adequately embedded within masonry walls",
              },
              {
                _id: "input_1c_4",
                score: 1,
                label:
                  "Roof structural elements adequately overlap wall structure to accomodate lateral movement",
              },
            ],
          },
        ],
      },
      {
        _id: "2_internal_comfort",
        title: "Internal comfort",
        type: "formGroup",
        children: [
          {
            _id: "2a_natural_ventilation",
            title: "Natural ventilation",
            type: "checkboxGroup",
            inputs: [
              {
                _id: "input_2a_1",
                score: 1,
                label:
                  "Ratio of window and ventilation openings area to floor area > 0.05",
              },
              {
                _id: "input_2a_2",
                score: 1,
                label:
                  "Ceiling height > 2m (in cold climate) or > 2.6m (in hot climate)",
              },
              {
                _id: "input_2a_3",
                score: 1,
                label: "Provision of a ceiling-level ventilation opening",
              },
            ],
          },
          {
            _id: "2b_thermal_comfort",
            title: "Thermal comfort",
            type: "checkboxGroup",
            inputs: [
              {
                _id: "input_2b_1",
                score: 1,
                label:
                  "Floor is elevated, with an air cavity to natural ground",
              },
              {
                _id: "input_2b_2",
                score: 0,
                label:
                  "Wall comprised of single layer of lightweight material (CGI, etc.)",
              },
              {
                _id: "input_2b_3",
                score: 1,
                label:
                  "Wall comprised of a single layer of masonry (brick, adobe, etc.)",
              },
              {
                _id: "input_2b_4",
                score: 2,
                label: "Wall comprised of multiple layers with air gap between",
              },
              {
                _id: "input_2b_5",
                score: 3,
                label:
                  "Wall comprised of multiple layers with insulation material between",
              },
              {
                _id: "input_2b_6",
                score: 0,
                label:
                  "Roof comprised of single layer of lightweight material (CGI, etc.)",
              },
              {
                _id: "input_2b_7",
                score: 1,
                label: "Roof comprised of multiple layers with air gap between",
              },
              {
                _id: "input_2b_8",
                score: 2,
                label:
                  "Roof comprised of multiple layers with insulation material between",
              },
            ],
          },
          {
            _id: "2c_natural_lighting",
            title: "Natural lighting",
            type: "checkboxGroup",
            inputs: [
              {
                _id: "input_2c_1",
                score: 1,
                label: "Ratio of windows area to floor area > 0.10",
              },
              {
                _id: "input_2c_2",
                score: 1,
                label: "Roof materials are translucent in part",
              },
              {
                _id: "input_2c_3",
                score: 1,
                label: "Wall materials are translucent in part",
              },
            ],
          },
        ],
      },
      {
        _id: "3_safety_and_security",
        title: "Safety and security",
        type: "formGroup",
        children: [
          {
            _id: "3a_fire_safety",
            title: "Fire safety",
            type: "checkboxGroup",
            inputs: [
              {
                _id: "input_3a_1",
                score: 1,
                label: "Roofing material is fire resistant",
              },
              {
                _id: "input_3a_2",
                score: 1,
                label: "Roof structure is fire resistant",
              },
              {
                _id: "input_3a_3",
                score: 1,
                label: "Wall material is fire resistant",
              },
              {
                _id: "input_3a_4",
                score: 1,
                label: "Wall structure is fire resistant",
              },
              {
                _id: "input_3a_5",
                score: 1,
                label: "Minimum setback distance between shelters",
              },
              {
                _id: "input_3a_6",
                score: 1,
                label:
                  "30m setback enforced between each 300m in built-up area",
              },
              {
                _id: "input_3a_7",
                score: 1,
                label:
                  "Designated cooking spaces with adequate ventilation and fire resistant materials provided",
              },
            ],
          },
          {
            _id: "3b_personal_security",
            title: "Personal Security",
            type: "checkboxGroup",
            inputs: [
              {
                _id: "input_3b_1",
                score: 1,
                label: "Door(s) lockable from inside (lock provided)",
              },
              {
                _id: "input_3b_2",
                score: 1,
                label: "Door(s) lockable from outside (lock provided)",
              },
              {
                _id: "input_3b_3",
                score: 1,
                label: "Windows lockable from inside (lock provided)",
              },
              {
                _id: "input_3b_4",
                score: 1,
                label: "Window opening dimensions < 60x60cm",
              },
              {
                _id: "input_3b_5",
                score: 1,
                label:
                  "Wall and roof cladding materials sufficiently strong to prevent breaking and entering",
              },
              {
                _id: "input_3b_6",
                score: 1,
                label: "Artificial lighting is provided inside shelter",
              },
              {
                _id: "input_3b_7",
                score: 1,
                label: "Artificial lighting is provided around shelter",
              },
            ],
          },
        ],
      },
      {
        _id: "4_construction_techniques",
        title: "Construction techniques",
        type: "checkboxGroup",
        inputs: [
          {
            _id: "input_4a",
            label:
              "Materials and construction/assembly techniques are common and well understood in the shelter locale",
            score: 1,
          },
          {
            _id: "input_4b",
            label:
              "Materials and construction/assembly techniques are well understood by the shelter occupants",
            score: 1,
          },
          {
            _id: "input_4c",
            label:
              "Training and resources are provided to enable shleter maintenance and repairs",
            score: 1,
          },
        ],
      },
    ],
  };
}
</script>
