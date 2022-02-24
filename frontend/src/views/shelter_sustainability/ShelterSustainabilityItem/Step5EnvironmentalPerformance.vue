<template>
  <v-form
    :readonly="!$can('edit', project)"
    v-if="project"
    @submit.prevent="() => submitForm(project)"
  >
    <v-container fluid>
      <v-row>
        <v-col>
          <h2 class="text-h4 project-shelter__h3 font-weight-medium">
            Environmental Performance
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider></v-divider>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-sheet elevation="2" rounded v-if="project">
            <v-container fluid>
              <v-row>
                <v-col class="about-first-column" lg="6" md="6" sm="12" xs="12">
                  <v-text-field
                    v-model="project.habitability.kikoo"
                    name="somelabel"
                    label="somelabel"
                    type="text"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row v-if="$can('edit', project)">
        <v-col class="d-flex justify-end">
          <v-btn type="submit"> Save changes </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Shelter } from "@/store/ShelterInterface";
import { cloneDeep } from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapState } from "vuex";

@Component({
  computed: {
    ...mapState("ShelterItemModule", ["shelter"]),
  },
  methods: {
    ...mapActions("ShelterItemModule", ["updateDoc"]),
  },
})
/** Project */
export default class Step3Materials extends Vue {
  shelter!: Shelter;
  updateDoc!: (doc: Shelter) => void;

  get project(): Shelter {
    // return {
    //   ...cloneDeep(this.shelter),
    //   habitability: this.shelter.habitability, // if you want to make reactive you have to predefine things
    // };
    return cloneDeep(this.shelter);
  }

  public submitForm(value: Shelter): void {
    if (value.name !== "") {
      this.updateDoc(value);
    } else {
      console.error("please send a valid document");
    }
  }
}
</script>
