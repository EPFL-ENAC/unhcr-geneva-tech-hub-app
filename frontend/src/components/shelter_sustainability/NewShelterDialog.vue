<template>
  <v-dialog v-model="dialogOpen" max-width="500px">
    <v-form v-model="createProjectFormValid" @submit.prevent="submitForm">
      <v-card>
        <v-card-title>
          <span class="text-h5">New shelter</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            ref="newName"
            v-model="newName"
            tabindex="1"
            :rules="rules"
            required
            name="name"
            label="Shelter name"
            type="text"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            tabindex="4"
            text
            @click="closeSiteDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            tabindex="3"
            :disabled="!createProjectFormValid"
            submit
            type="submit"
            text
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import CountrySelect from "@/components/commons/CountrySelect.vue";
import { Shelter } from "@/store/ShelterInterface";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterModule", ["shelters", "db"]),
  },

  methods: {
    ...mapActions("ShelterModule", ["addDoc"]),
  },
  components: {
    CountrySelect,
  },
})
/** ProjectList */
export default class NewShelterDialog extends Vue {
  @Prop({ type: Boolean, default: false })
  readonly open!: boolean;

  $refs!: {
    newName: HTMLInputElement;
  };

  shelters!: [];
  addDoc!: (name: string) => Promise<null>;

  newName = "";

  get dialogOpen(): boolean {
    return this.open;
  }
  set dialogOpen(v: boolean) {
    this.$emit("update:open", v);
  }

  get existingNames(): string[] {
    return this.shelters
      .filter((shelter: Shelter) => shelter._id != undefined)
      .map((shelter: Shelter) => shelter?._id ?? "");
  }
  public closeSiteDialog(): void {
    this.dialogOpen = false;
  }

  createProjectFormValid = true;

  public ruleShelterAlreadyExist(value: string): boolean | string {
    return (
      this.existingNames.indexOf(value) === -1 ||
      `A shelter with this _id (name) already exist`
    );
  }

  rules = [
    (v: string): boolean | string => !!v || `A name is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `Name should have a length >= 1`,
    this.ruleShelterAlreadyExist,
  ];

  public submitForm(): void {
    if (this.newName !== "") {
      this.addDoc(this.newName).then(() => {
        this.$router.push({
          name: "ShelterSustainabilityEdit",
          params: { id: encodeURIComponent(this.newName) },
        });
      });
    } else {
      console.error("please fill the new Name");
    }
  }

  @Watch("open")
  onOpenChange(newValue: boolean): void {
    if (newValue) {
      Vue.nextTick().then(() => {
        this.$refs.newName?.focus();
      });
    }
  }
}
</script>
