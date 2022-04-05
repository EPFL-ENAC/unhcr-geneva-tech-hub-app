<template>
  <v-form
    v-if="localShelter.technical_performance"
    @submit.prevent="() => submitForm(localShelter)"
  >
    <component
      :is="technicalPerformanceForm.type"
      :form="technicalPerformanceForm"
      :value="localShelter.technical_performance"
      @input="(v) => update(v)"
    ></component>
    <v-container fluid>
      <v-row>
        <v-col class="d-flex justify-end">
          <v-btn type="submit" tabindex="2">Save changes</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import FormGroup from "@/components/shelter_sustainability/FormGroup.vue";
import { Score, Shelter } from "@/store/ShelterInterface";
import technicalPerformanceForm from "@/views/shelter_sustainability/ShelterSustainabilityItem/technicalPerformanceForm";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapState } from "vuex";

@Component({
  components: {
    FormGroup,
  },
  computed: {
    ...mapState("ShelterModule", ["shelter"]),
  },
  methods: {
    ...mapActions("ShelterModule", ["updateDoc"]),
  },
})
/** Project */
export default class Step6 extends Vue {
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

  get technical_performance(): Score {
    return this.localShelter.technical_performance;
  }
  public async update(value: Score): Promise<void> {
    this.localShelter.technical_performance = value;
    const values = Object.values(value) as number[];
    this.localShelter.technical_performance_score = values.reduce(
      (acc, el) => acc + el
    );
  }

  public async submitForm(value: Shelter): Promise<void> {
    await this.updateDoc(value);
  }

  technicalPerformanceForm = technicalPerformanceForm;
}
</script>
