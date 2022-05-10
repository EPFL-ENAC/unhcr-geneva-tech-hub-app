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
            label="Name"
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
          <v-btn color="blue darken-1" tabindex="3" submit type="submit" text>
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import CountrySelect from "@/components/commons/CountrySelect.vue";
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
  @Prop(Boolean)
  readonly open: boolean = false;

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

  public closeSiteDialog(): void {
    this.dialogOpen = false;
  }

  createProjectFormValid = true;
  rules = [
    (v: string): boolean | string => !!v || `A name is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `Name should have a length >= 1`,
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
