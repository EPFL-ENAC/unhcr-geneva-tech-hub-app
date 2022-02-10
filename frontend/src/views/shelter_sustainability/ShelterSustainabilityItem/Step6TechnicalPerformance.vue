<template>
  <v-container v-if="this.shelter">
    <!-- todo: replace v-if by loading -->
    <v-row>
      <v-col>
        <h2 class="project-shelter__header text-h2">Technical Performance</h2>
      </v-col>
      <v-col class="d-flex justify-center align-end">
        <p>score: {{ score }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-spacer />
    <v-form @submit.prevent="() => submitForm(technical_performance)">
      <v-row v-for="(form, $index) in forms" :key="$index">
        <v-col>
          <!-- TODO: replace that code duplication by component is logic -->
          <radio-group
            :form="form"
            :value="technical_performance[form._id]"
            @input="(v) => updateTechnicalPerformance(form._id, v)"
            v-if="form.type === 'radioGroup'"
          ></radio-group>
          <checkbox-group
            :form="form"
            :value="technical_performance[form._id]"
            @input="(v) => updateTechnicalPerformance(form._id, v)"
            v-else-if="form.type === 'checkboxGroup'"
          ></checkbox-group>
          <form-group
            :form="form"
            :value="technical_performance[form._id]"
            @input="(v) => updateTechnicalPerformance(form._id, v)"
            v-else-if="form.type === 'formGroup'"
          ></form-group>
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
import { Component, Vue } from "vue-property-decorator";
import CheckboxGroup from "@/components/shelter_sustainability/CheckboxGroup.vue";
import RadioGroup from "@/components/shelter_sustainability/RadioGroup.vue";
import FormGroup from "@/components/shelter_sustainability/FormGroup.vue";
import { mapState, mapActions } from "vuex";
import Shelter from "@/store/ShelterInterface";
import {
  Score,
  ShelterPerformance,
  TechnicalPerformance,
} from "@/store/ShelterInterface";

@Component({
  components: {
    RadioGroup,
    CheckboxGroup,
    FormGroup,
  },
  computed: {
    ...mapState("ShelterItemModule", ["shelter"]),
  },
  methods: {
    ...mapActions("ShelterItemModule", ["updateDoc"]),
  },
})
/** Project */
export default class Step6 extends Vue {
  shelter!: Shelter;
  updateDoc!: (doc: Shelter) => void;

  computeScore(levels: number[] | Score[]) {
    return levels.reduce((acc: number, level: number | Score) => {
      if (typeof level === "object") {
        return acc + this.computeScore(Object.values(level));
      } else {
        return acc + level;
      }
    }, 0 as number);
  }

  get score() {
    // TODO: externalize score
    // does not work because of sublevel FIXME
    return this.computeScore(Object.values(this.technical_performance));
  }

  public updateTechnicalPerformance(
    formId: string,
    value: Score | ShelterPerformance
  ) {
    this.technical_performance[formId] = value;
    // since this.technical_perfomance is a reference to this.shelter it works
    this.$store.commit("ShelterItemModule/SET_SHELTER", this.shelter);
  }
  get technical_performance() {
    return this.shelter.technical_performance;
  }
  public submitForm(value: TechnicalPerformance): void {
    this.shelter.technical_performance = value;
    // validation should be here!
    this.updateDoc(this.shelter);
  }

  forms = [
    {
      _id: "1_hazard",
      title: "Hazard-related structural performance",
      type: "formGroup",
      inputs: [
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
              label: "Continuous ring beam provided along top of masonry wall",
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
      inputs: [
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
              label: "Floor is elevated, with an air cavity to natural ground",
            },
            {
              _id: "input_2b_2",
              score: 1,
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
              score: 1,
              label: "Wall comprised of multiple layers with air gap between",
            },
            {
              _id: "input_2b_5",
              score: 1,
              label:
                "Wall comprised of multiple layers with insulation material between",
            },
            {
              _id: "input_2b_6",
              score: 1,
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
              score: 1,
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
      inputs: [
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
              label: "30m setback enforced between each 300m in built-up area",
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
  ];

  // {
  // _id: "1_floor",
  // title: "Floor Area",
  // type: "radioGroup", // could be checkbox group also
  // inputs: [
  //   {
  //     _id: "input1",
  //     label: "Floor area is >=3.5m2 (in hot climate - Sphere Standard)",
  //     score: 1,
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eget imperdiet ipsum, eget porta ex. Nam mi nibh, aliquet ultrices justo nec, pharetra blandit odio. Morbi vehicula pretium tortor sit amet pellentesque. Morbi lobortis vulputate interdum. Duis ante elit, imperdiet mattis congue sed, auctor ac dolor. Phasellus vitae faucibus tellus. Ut blandit, ligula quis eleifend tristique, velit ipsum auctor justo, at porttitor nunc tortor sit amet justo. Sed fermentum metus eget laoreet vestibulum. Vestibulum sed tellus vitae turpis egestas elementum. ",
  //   },
}
</script>
