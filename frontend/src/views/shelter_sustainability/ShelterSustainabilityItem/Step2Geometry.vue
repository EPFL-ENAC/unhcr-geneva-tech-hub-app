<template>
  <form v-if="project" @submit.prevent="() => submitForm(project)">
    <v-container fluid>
      <v-row>
        <v-col>
          <h2 class="text-h4 project-shelter__h3 font-weight-medium">
            Geometry
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="(geometry, $index) in geometries"
          :key="$index"
          v-show="
            shelter_geometry_type === geometry._id ||
            shelter_geometry_type === ''
          "
          class="geometry-column"
          :lg="shelter_geometry_type ? 6 : 3"
          :md="shelter_geometry_type ? 6 : 4"
          sm="12"
          xs="12"
        >
          <v-card>
            <v-card-title
              class="d-flex justify-center"
              @click="() => toggleImage(geometry._id)"
            >
              <v-img
                max-width="300px"
                class="d-flex justify-center"
                :src="geometry.image_url"
              ></v-img>
            </v-card-title>

            <v-card-text
              class="flex-gap-sm d-flex flex-column justify-space-between"
            >
              <v-expand-transition>
                <div v-show="shelter_geometry_type">
                  <v-card>
                    <v-card-title>Shelter dimensions</v-card-title>
                    <v-form class="pa-md-4">
                      <v-text-field
                        v-for="(dimension, key) in geometry.shelter_dimensions"
                        :key="key"
                        v-model="project.shelter_dimensions[dimension]"
                        :name="dimension"
                        :label="dimension"
                        type="number"
                      />
                    </v-form>
                  </v-card>
                  <v-card
                    v-for="(door, $doorKey) in project.doors_dimensions"
                    :key="$doorKey"
                  >
                    <!-- v-for on all windows -->
                    <v-card-title>Door dimensions</v-card-title>
                    <v-form class="pa-md-4">
                      <v-text-field
                        v-for="(dimension, key) in geometry.door_dimensions"
                        :key="key"
                        v-model="project.doors_dimensions[$doorKey][dimension]"
                        :name="dimension"
                        :label="dimension"
                        type="number"
                      />
                    </v-form>
                  </v-card>
                  <v-card
                    v-for="(window, $windowKey) in project.windows_dimensions"
                    :key="$windowKey"
                  >
                    <!-- v-for on all windows -->
                    <v-card-title>Window dimensions</v-card-title>
                    <v-form class="pa-md-4">
                      <v-text-field
                        v-for="(dimension, key) in geometry.window_dimensions"
                        :key="key"
                        v-model="
                          project.windows_dimensions[$windowKey][dimension]
                        "
                        :name="dimension"
                        :label="dimension"
                        type="number"
                      />
                    </v-form>
                  </v-card>
                  <v-container>
                    <v-btn block @click="addWindow">Add window</v-btn>
                  </v-container>
                </div>
              </v-expand-transition>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="6" v-if="shelter_geometry_type">
          <v-card>
            <v-card-title> Dimensions </v-card-title>
            <v-card-text>
              <div>Floor area:</div>
              <div>Volume:</div>
              <div>Window area</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="d-flex justify-end">
          <v-btn type="submit">Save changes</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </form>
</template>

<style lang="scss">
.flex-gap-sm {
  gap: 16px;
}
</style>

<script lang="ts">
import { Shelter } from "@/store/ShelterInterface";
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
export default class Step2Geometry extends Vue {
  shelter!: Shelter;
  updateDoc!: (doc: Shelter) => void;
  shelter_geometry_type = "";

  get project(): Shelter {
    return { ...this.shelter };
  }

  // get shelter_geometry_type(): string {
  //   return this.project.shelter_geometry_type || "";
  // }

  // set shelter_geometry_type(value: string) {
  //   this.project.shelter_geometry_type = value;
  // }

  public submitForm(value: Shelter): void {
    if (value.name !== "") {
      console.log("setter shelter", value);
      this.updateDoc(value);
    } else {
      console.error("please fill the new Name");
    }
  }

  public toggleImage(_id: string): void {
    if (this.shelter_geometry_type === "") {
      this.shelter_geometry_type = _id;
    } else {
      this.shelter_geometry_type = "";
    }
  }

  public addWindow(): void {
    this.project.windows_dimensions.push({ Ww: 0, Hw: 0, Hs: 0 });
  }

  geometries = [
    {
      _id: "gableHW",
      image_url: "/houses_new/SSC_P1_Shelter-GableHW_220201.png",
      shelter_dimensions: ["L", "W", "H1", "H2"],
      door_dimensions: ["Wd", "Hd"],
      window_dimensions: ["Ww", "Hw", "Hs"],
    },
    {
      _id: "gabelLW",
      image_url: "/houses_new/SSC_P2_Shelter-GableLW_220201.png",
      shelter_dimensions: ["L", "W", "H1", "H2"],
      door_dimensions: ["Wd", "Hd"],
      window_dimensions: ["Ww", "Hw", "Hs"],
    },
    {
      _id: "flatRoof",
      image_url: "/houses_new/SSC_P3_Shelter-FlatRoof_220201.png",
      shelter_dimensions: ["L", "W", "H"],
      door_dimensions: ["Wd", "Hd"],
      window_dimensions: ["Ww", "Hw", "Hs"],
    },
    {
      _id: "dome",
      image_url: "/houses_new/SSC_P4_Shelter-Dome_220201.png",
      shelter_dimensions: ["L", "W", "H"],
      door_dimensions: ["Wd", "Hd"],
      window_dimensions: ["Ww", "Hw", "Hs"],
    },
  ];
}
</script>
