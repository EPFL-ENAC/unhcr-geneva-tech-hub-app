<template>
  <v-form v-if="localShelter.habitability">
    <component
      :is="habitabilityForm.type"
      :form="habitabilityForm"
      :value="localShelter.habitability"
      @input="(v) => update(v)"
    ></component>
  </v-form>
</template>

<script lang="ts">
import FormGroup from "@/components/shelter_sustainability/FormGroup.vue";
import { Score, Shelter } from "@/store/ShelterInterface";
import habitabilityForm from "@/views/shelter_sustainability/ShelterSustainabilityItem/habitabilityForm";
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
    this.submitForm(this.localShelter);
  }

  public async submitForm(value: Shelter): Promise<void> {
    await this.updateDoc(value);
  }

  habitabilityForm = habitabilityForm;
}
</script>
