<template>
  <v-container v-if="this.shelter">
    <!-- todo: replace v-if by loading -->
    <v-row>
      <v-col>
        <h2 class="project-shelter__header text-h2">Habitability</h2>
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
    <v-form
      @submit.prevent="() => submitForm(habitability)"
    >
      <v-row v-for="(form, $index) in forms" :key="$index">
        <v-col>
          <radio-group
            :form="form"
            :value="habitability[form._id]"
            @input="(v) => updateHabitability(form._id, v)"
            v-if="form.type === 'radioGroup'"
          ></radio-group>
          <checkbox-group
            :form="form"
            :value="habitability[form._id]"
            @input="(v) => updateHabitability(form._id, v)"
            v-else-if="form.type === 'checkboxGroup'"
          ></checkbox-group>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn type="submit"> Save changes </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CheckboxGroup from "@/components/shelter_sustainability/CheckboxGroup.vue";
import RadioGroup from "@/components/shelter_sustainability/RadioGroup.vue";

import { mapState, mapActions } from "vuex";
import Shelter from "@/store/ShelterInterface";
import { Habitability, Score } from "@/store/ShelterInterface";
@Component({
  components: {
    RadioGroup,
    CheckboxGroup,
  },
  computed: {
    ...mapState("ShelterItemModule", ["shelter"]),
  },
  methods: {
    ...mapActions("ShelterItemModule", ["updateDoc"]),
  },
})
/** Project */
export default class Step7 extends Vue {
  shelter!: Shelter;
  updateDoc!: (doc: Shelter) => void;

  get score() {
    // TODO: externalize score
    return Object.values(this.habitability)
      .map((el) => Object.values(el).reduce((acc, y) => acc + y, 0))
      .reduce((acc, z) => acc + z, 0);
  }

  public updateHabitability(formId: string, value: Score) {
    this.habitability[formId] = value;
    // since this.habitability is a reference to this.shelter it works
    this.$store.commit("ShelterItemModule/SET_SHELTER", this.shelter);
  }
  get habitability() {
    return this.shelter.habitability;
  }
  public submitForm(value: Habitability): void {
    this.shelter.habitability = value;
    // validation should be here!
    this.updateDoc(this.shelter);
  }

  forms = [
    {
      _id: "1_floor",
      title: "Floor Area",
      type: "radioGroup", // could be checkbox group also
      inputs: [
        {
          _id: "input1",
          label: "Floor area is >=3.5m2 (in hot climate - Sphere Standard)",
          score: 1,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eget imperdiet ipsum, eget porta ex. Nam mi nibh, aliquet ultrices justo nec, pharetra blandit odio. Morbi vehicula pretium tortor sit amet pellentesque. Morbi lobortis vulputate interdum. Duis ante elit, imperdiet mattis congue sed, auctor ac dolor. Phasellus vitae faucibus tellus. Ut blandit, ligula quis eleifend tristique, velit ipsum auctor justo, at porttitor nunc tortor sit amet justo. Sed fermentum metus eget laoreet vestibulum. Vestibulum sed tellus vitae turpis egestas elementum. ",
        },
        {
          _id: "input2",
          label: "Floor area is >=4.5m2 (in cold climate - Sphere Standard)",
          score: 1,
        },
        {
          _id: "input3",
          label:
            "Floor area is in accordance with local housing standards and socio-cultural norms",
          score: 1,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eget imperdiet ipsum, eget porta ex. Nam mi nibh, aliquet ultrices justo nec, pharetra blandit odio. Morbi vehicula pretium tortor sit amet pellentesque. Morbi lobortis vulputate interdum. Duis ante elit, imperdiet mattis congue sed, auctor ac dolor. Phasellus vitae faucibus tellus. Ut blandit, ligula quis eleifend tristique, velit ipsum auctor justo, at porttitor nunc tortor sit amet justo. Sed fermentum metus eget laoreet vestibulum. Vestibulum sed tellus vitae turpis egestas elementum. ",
        },
        {
          _id: "input4",
          label:
            "Floor area is in accordance with immediate constraints of the stage of shelter response",
          score: 1,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eget imperdiet ipsum, eget porta ex. Nam mi nibh, aliquet ultrices justo nec, pharetra blandit odio. Morbi vehicula pretium tortor sit amet pellentesque. Morbi lobortis vulputate interdum. Duis ante elit, imperdiet mattis congue sed, auctor ac dolor. Phasellus vitae faucibus tellus. Ut blandit, ligula quis eleifend tristique, velit ipsum auctor justo, at porttitor nunc tortor sit amet justo. Sed fermentum metus eget laoreet vestibulum. Vestibulum sed tellus vitae turpis egestas elementum. ",
        },
      ],
    },
    {
      _id: "2_accessibility",
      title: "Accessibility",
      type: "checkboxGroup",
      inputs: [
        {
          _id: "input5",
          label: "Door(s) >= 90cm wide",
          score: 1,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eget imperdiet ipsum, eget porta ex. Nam mi nibh, aliquet ultrices justo nec, pharetra blandit odio. Morbi vehicula pretium tortor sit amet pellentesque. Morbi lobortis vulputate interdum. Duis ante elit, imperdiet mattis congue sed, auctor ac dolor. Phasellus vitae faucibus tellus. Ut blandit, ligula quis eleifend tristique, velit ipsum auctor justo, at porttitor nunc tortor sit amet justo. Sed fermentum metus eget laoreet vestibulum. Vestibulum sed tellus vitae turpis egestas elementum. ",
        },
        {
          _id: "input6",
          label:
            "Ramp access with slope not greater than 1 in 8 with handrail provided to any elevated floor",
          score: 1,
        },
        { _id: "input7", label: "Toilet door(s) open outward", score: 1 },
      ],
    },
    {
      _id: "3_privacy",
      title: "Privacy",
      type: "checkboxGroup",
      inputs: [
        {
          _id: "input8",
          label: "An internal partition is provide that ensures visual privacy",
          score: 1,
        },
        {
          _id: "input9",
          label:
            "The design accomodates addition of an internal partition to provide visual privacy",
          score: 1,
        },
        {
          _id: "input10",
          label:
            "Wall cladding materials sufficiently opaque to provide visual privacy, including when lit inside",
          score: 1,
        },
        {
          _id: "input11",
          label: "Wall and roof cladding materials provide acoustic privacy",
          score: 1,
        },
      ],
    },
    {
      _id: "4_artificial_lighting",
      title: "Artificial lighting",
      type: "checkboxGroup",
      inputs: [
        {
          _id: "input12",
          label: "Artificial lighting is provided inside shelter",
          score: 1,
        },
        {
          _id: "input13",
          label: "Artificial lighting is provided around shelter",
          score: 1,
        },
      ],
    },
    {
      _id: "5_complimentary_facilities",
      title: "Complementary facilities",
      type: "checkboxGroup",
      inputs: [
        {
          _id: "input14",
          label:
            "Designated cooking spaces with adequate ventilation and fire resistant materials provided",
          score: 1,
        },
        {
          _id: "input15",
          label:
            "Toilets are provided that are rapidly and safely accessible for all users",
          score: 1,
        },
        {
          _id: "input16",
          label:
            "Showers are provided that are rapidly and safely accessible for all users",
          score: 1,
        },
        {
          _id: "input17",
          label: "Human waste management arrangements are safe and sustainable",
          score: 1,
        },
        {
          _id: "input18",
          label:
            "Solid waste management arrangements are non-polluting and hygenic",
          score: 1,
        },
      ],
    },
  ];
}
</script>
