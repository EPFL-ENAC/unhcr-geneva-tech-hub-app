<template>
  <v-form
    v-if="localShelter.habitability"
    @submit.prevent="() => submitForm(localShelter)"
  >
    <component
      :is="habitabilityForm.type"
      :form="habitabilityForm"
      :value="localShelter.habitability"
      @input="(v) => update(v)"
    ></component>
    <v-container fluid>
      <v-row>
        <v-col class="d-flex justify-end">
          <v-btn type="submit">Save changes</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import FormGroup from "@/components/shelter_sustainability/FormGroup.vue";
import { Score, Shelter } from "@/store/ShelterInterface";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  components: {
    FormGroup,
  },
  computed: {
    ...mapGetters("ShelterModule", ["shelter"]),
  },
  methods: {
    ...mapActions("ShelterModule", ["updateDoc"]),
  },
})
/** Project */
export default class Step7 extends Vue {
  shelter!: Shelter;
  updateDoc!: (doc: Shelter) => void;

  localShelter = {} as Shelter;

  public setLocalShelter(): void {
    if (!this.shelter) {
      this.localShelter = {} as Shelter;
    } else {
      this.localShelter = cloneDeep(this.shelter);
    }
  }

  public syncLocalShelter(): void {
    // init function
    this.setLocalShelter();

    this.$store.subscribe((mutation) => {
      const shouldUpdate = ["ShelterModule/SET_SHELTER"];
      if (shouldUpdate.includes(mutation.type)) {
        this.setLocalShelter();
      }
    });
  }

  created(): void {
    this.syncLocalShelter();
  }

  get habitability(): Score {
    return this.localShelter.habitability;
  }
  public async update(value: Score): Promise<void> {
    this.localShelter.habitability = value;
    const values = Object.values(value) as number[];
    this.localShelter.habitability_score = values.reduce((acc, el) => acc + el);
  }

  public async submitForm(value: Shelter): Promise<void> {
    await this.updateDoc(value);
  }

  habitabilityForm = {
    _id: "habitability",
    title: "Habitability",
    type: "formGroup",
    children: [
      {
        _id: "1_floor",
        title: "Floor Area",
        type: "radioGroup", // could be checkbox group also
        children: [
          {
            _id: "input1",
            label: "Floor area is >=3.5m2 (in hot climate - Sphere Standard)",
            score: 1,
            image: "/shelter/habitability/floor_area.png",
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
        children: [
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
        children: [
          {
            _id: "input8",
            label:
              "An internal partition is provide that ensures visual privacy",
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
        children: [
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
        children: [
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
            label:
              "Human waste management arrangements are safe and sustainable",
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
    ],
  };
}
</script>
