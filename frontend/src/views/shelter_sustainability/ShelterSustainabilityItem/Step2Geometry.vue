<template>
  <v-container fluid v-if="localShelter.users">
    <v-form
      :readonly="!$can('edit', localShelter)"
      @submit.prevent="() => submitForm(localShelter)"
    >
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
          :lg="shelter_geometry_type ? 12 : 3"
          :md="shelter_geometry_type ? 12 : 4"
          sm="12"
          xs="12"
        >
          <v-hover v-slot="{ hover }">
            <v-card :elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-card-title
                    v-bind="attrs"
                    v-on="on"
                    class="d-flex justify-center"
                    @click="() => toggleImage(geometry._id)"
                  >
                    <v-img
                      max-width="300px"
                      class="d-flex justify-center"
                      :src="geometry.image_url"
                      :aria-label="geometry._id"
                    ></v-img>
                    <v-btn icon @click.stop="selectedItem = geometry">
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                  </v-card-title>
                </template>
                <span>{{ geometry._id }}</span>
              </v-tooltip>

              <v-card-text
                class="flex-gap-sm d-flex flex-column justify-space-between"
                v-if="!geometry.hiddenInputs"
              >
                <v-expand-transition>
                  <v-row v-show="shelter_geometry_type">
                    <v-col :lg="4" :md="6" sm="12" xs="12">
                      <v-card>
                        <v-card-title>Shelter dimensions</v-card-title>
                        <v-form class="pa-md-4">
                          <v-text-field
                            v-for="(
                              dimension, $shelterDimensionsKey
                            ) in geometry.shelter_dimensions"
                            :key="`shelterDimension${$shelterDimensionsKey}`"
                            v-model.number="
                              localShelter.geometry.shelter_dimensions[
                                dimension
                              ]
                            "
                            :name="dimension"
                            :label="dimension"
                            suffix="m"
                            type="number"
                          />
                        </v-form>
                      </v-card>
                    </v-col>
                    <v-col :lg="4" :md="6" sm="12" xs="12">
                      <v-card
                        v-for="(door, $doorKey) in localShelter.geometry
                          .doors_dimensions"
                        :key="`doorsDimension${$doorKey}`"
                      >
                        <!-- v-for on all windows -->
                        <v-card-title>Door dimensions</v-card-title>
                        <v-form class="pa-md-4">
                          <v-text-field
                            v-for="(
                              dimension, $doorDimensionsKey
                            ) in geometry.door_dimensions"
                            :key="`doorDimension${$doorDimensionsKey}`"
                            v-model.number="
                              localShelter.geometry.doors_dimensions[$doorKey][
                                dimension
                              ]
                            "
                            :name="dimension"
                            :label="dimension"
                            suffix="m"
                            type="number"
                          />
                        </v-form>
                      </v-card>
                    </v-col>
                    <v-col
                      :lg="4"
                      :md="6"
                      sm="12"
                      xs="12"
                      v-for="(window, $windowKey) in localShelter.geometry
                        .windows_dimensions"
                      :key="`windowsDimensions${$windowKey}`"
                    >
                      <v-card>
                        <!-- v-for on all windows -->
                        <v-card-title class="d-flex justify-space-between">
                          Window dimensions
                          <v-btn
                            :disabled="!$can('edit', localShelter)"
                            icon
                            @click="removeWindow($windowKey)"
                          >
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </v-card-title>
                        <v-form class="pa-md-4">
                          <v-text-field
                            v-for="(
                              dimension, $windowDimensions
                            ) in geometry.window_dimensions"
                            :key="`windowDimensions${$windowDimensions}`"
                            v-model.number="
                              localShelter.geometry.windows_dimensions[
                                $windowKey
                              ][dimension]
                            "
                            :name="dimension"
                            :label="dimension"
                            suffix="m"
                            type="number"
                          />
                        </v-form>
                      </v-card>
                    </v-col>
                    <v-col :lg="4" :md="6" sm="12" xs="12">
                      <v-btn
                        block
                        @click="addWindow"
                        :disabled="!$can('edit', localShelter)"
                        >Add window</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-expand-transition>
              </v-card-text>
              <v-card v-if="shelter_geometry_type">
                <v-card-title> Result dimensions </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col
                      v-for="(resultDimension, $key) in dimensions"
                      :key="$key"
                      :lg="4"
                      :md="6"
                      sm="12"
                      xs="12"
                    >
                      <v-text-field
                        :disabled="!geometry.hiddenInputs"
                        v-model.number="
                          localShelter.geometry[resultDimension.key]
                        "
                        :name="resultDimension.label"
                        :label="resultDimension.label"
                        type="number"
                        :suffix="resultDimension.suffix"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>

      <v-row v-if="$can('edit', localShelter)">
        <v-col class="d-flex justify-end">
          <v-btn type="submit"> Save changes </v-btn>
        </v-col>
      </v-row>
      <v-overlay v-if="selectedItem" @click="selectedItem = null">
        <v-img
          :src="selectedItem ? selectedItem.image_url : ''"
          contain
          @click="selectedItem = null"
        ></v-img>
      </v-overlay>
    </v-form>
  </v-container>
</template>

<style lang="scss">
.flex-gap-sm {
  gap: 16px;
}
</style>

<script lang="ts">
import {
  DoorDimensions,
  Shelter,
  ShelterDimensions,
  WindowDimensions,
} from "@/store/ShelterInterface";
import { getNewGeometry } from "@/store/ShelterModuleUtils";
import { cloneDeep } from "lodash";
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

/* two ways to have a store copy locally
1. having a watcher on the store that cloneDeep to data() locally
2. having a subscriber to mutation that's initialized at created
cf: https://forum.vuejs.org/t/best-way-to-use-forms-with-local-state-using-v-model-and-sync-to-vuex-store-on-save/24739
for the original discussion
*/
@Component({
  computed: {
    ...mapGetters("ShelterModule", ["shelter"]),
  },
  methods: {
    ...mapActions("ShelterModule", ["updateDoc"]),
  },
})
/** Project */
export default class Step2Geometry extends Vue {
  shelter!: Shelter;
  updateDoc!: (doc: Shelter) => void;

  localShelter = {} as Shelter;
  selectedItem = null;

  public setLocalShelter(): void {
    if (!this.shelter) {
      return;
    }
    const localClone = cloneDeep(this.shelter);
    if (!localClone.geometry) {
      localClone.geometry = getNewGeometry();
    }
    this.localShelter = localClone;
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

  public created(): void {
    this.syncLocalShelter();
  }

  public submitForm(value: Shelter): void {
    if (value.name !== "") {
      this.updateDoc(value);
    } else {
      console.error("please fill the new Name");
    }
  }

  public toggleImage(_id: string): void {
    if (this.localShelter.geometry.shelter_geometry_type === "") {
      this.localShelter.geometry.shelter_geometry_type = _id;
    } else {
      this.localShelter.geometry.shelter_geometry_type = "";
    }
  }
  get shelter_geometry_type(): string {
    return this.localShelter?.geometry?.shelter_geometry_type;
  }

  public addWindow(): void {
    this.localShelter.geometry.windows_dimensions.push({ Ww: 0, Hw: 0, Hs: 0 });
  }
  public removeWindow(index: number): void {
    this.localShelter.geometry.windows_dimensions.splice(index, 1);
  }

  public get hasComputedFloorAndVolume(): boolean {
    const geometryType =
      this.localShelter?.geometry?.shelter_geometry_type ?? "";
    return (
      geometryType.indexOf(this.geometryOtherName) === -1 && geometryType !== ""
    );
  }

  @Watch("localShelter.geometry.shelter_dimensions", { deep: true })
  public onShelterDimensionsChange(
    newShelterDimensions: ShelterDimensions
  ): void {
    if (newShelterDimensions && this.hasComputedFloorAndVolume) {
      // we need at least L && W for floor Area and Volume
      // works for other since L & W will always be zero for 'Others' type of geometry
      this.localShelter.geometry.floorArea =
        this.floorArea(newShelterDimensions);
      this.localShelter.geometry.volume =
        this.computeVolume(newShelterDimensions);
    }
  }

  @Watch("localShelter.geometry.windows_dimensions", { deep: true })
  public onWindowsDimensionsChange(
    newWindowDimensions: WindowDimensions[]
  ): void {
    if (newWindowDimensions && this.hasComputedFloorAndVolume) {
      this.localShelter.geometry.windowArea =
        this.windowDimensions(newWindowDimensions) +
        this.doorDimensions(this.localShelter.geometry.doors_dimensions);
    }
  }

  @Watch("localShelter.geometry.doors_dimensions", { deep: true })
  public onDoorsDimensionsChange(newDoorDimensions: DoorDimensions[]): void {
    if (newDoorDimensions && this.hasComputedFloorAndVolume) {
      this.localShelter.geometry.windowArea =
        this.windowDimensions(this.localShelter.geometry.windows_dimensions) +
        this.doorDimensions(newDoorDimensions);
    }
  }

  @Watch("localShelter.geometry.shelter_geometry_type", { immediate: false })
  public onGeometryTypeChange(shelter_geometry_type: string): void {
    // reset all dimensions when no shelter geometry selected
    if (shelter_geometry_type === "") {
      this.localShelter.geometry = {
        ...getNewGeometry(),
        shelter_geometry_type,
      };
    }
  }

  private doorDimensions(doorDimensions: DoorDimensions[]): number {
    if (doorDimensions.length === 0) {
      return 0;
    }
    return doorDimensions
      .map(({ Wd, Hd }) => {
        if (!Wd || !Hd) {
          return 0; // missing Wd or Hd area is 0
        }
        return Wd * Hd;
      })
      .reduce((doorsArea, doorArea) => doorsArea + doorArea);
  }
  // externalize somehwere
  private windowDimensions(windowDimensions: WindowDimensions[]): number {
    if (windowDimensions.length === 0) {
      return 0;
    }
    return windowDimensions
      .map(({ Ww, Hw }) => {
        if (!Ww || !Hw) {
          return 0; // missing Ww or Hw area is 0
        }
        return Ww * Hw;
      })
      .reduce((windowsArea, windowArea) => windowsArea + windowArea);
  }

  private floorArea(shelterDimension: ShelterDimensions): number {
    const { L, W } = shelterDimension || {};
    if (!L || !W) {
      return 0; // Length or Width not defined
    }
    if (this.shelter_geometry_type === "dome") {
      const surfaceAreaEllipse = Math.PI * (L / 2) * (W / 2);
      // better to use toPrecision(3)
      return Math.floor(surfaceAreaEllipse * 100) / 100;
    }
    return L * W;
  }

  private computeVolume(shelterDimension: ShelterDimensions): number {
    const geometry = this.geometries.find(
      (g) => g._id === this.shelter_geometry_type
    );
    if (geometry?.volumeFunction) {
      return geometry.volumeFunction(shelterDimension);
    }
    throw new Error("should not have a volume");
  }

  dimensions = [
    { label: "Floor area", key: "floorArea", suffix: "m²" },
    { label: "Volume", key: "volume", suffix: "m³" },
    { label: "Openings area", key: "windowArea", suffix: "m²" },
  ];

  geometryOtherName = "other";

  geometries = [
    {
      _id: "gableHW", // High wall
      name: "Gable roof",
      image_url: "/houses_new/SSC_P1_Shelter-GableHW_220201.png",
      shelter_dimensions: ["L", "W", "H1", "H2"],
      door_dimensions: ["Wd", "Hd"],
      window_dimensions: ["Ww", "Hw", "Hs"],
      volumeFunction(shelterDimension: ShelterDimensions): number {
        const { L, W, H1, H2 } = shelterDimension || {};
        if (!L || !W || !H1 || !H2) {
          return 0; // one dimension undefined volume is 0 by default
        }
        return L * W * H1 + 0.5 * L * W * (H2 - H1);
      },
    },
    {
      _id: "flatRoof",
      name: "Single pitch roof",
      image_url: "/houses_new/SSC_P3_Shelter-FlatRoof_220201.png",
      shelter_dimensions: ["L", "W", "H"],
      door_dimensions: ["Wd", "Hd"],
      window_dimensions: ["Ww", "Hw", "Hs"],
      volumeFunction(shelterDimension: ShelterDimensions): number {
        const { L, W, H } = shelterDimension || {};
        if (!L || !W || !H) {
          return 0; // one dimension undefined volume is 0 by default
        }
        return L * W * H;
      },
    },
    {
      _id: "dome",
      name: "Dome",
      image_url: "/houses_new/SSC_P4_Shelter-Dome_220201.png",
      shelter_dimensions: ["L", "W", "H"],
      door_dimensions: ["Wd", "Hd"],
      window_dimensions: ["Ww", "Hw", "Hs"],
      volumeFunction(shelterDimension: ShelterDimensions): number {
        const { L, W, H } = shelterDimension || {};
        if (!L || !W || !H) {
          return 0; // one dimension undefined volume is 0 by default
        }
        return 0.1666667 * Math.PI * L * W * H;
      },
    },
    {
      _id: this.geometryOtherName,
      name: "Other",
      hiddenInputs: true,
      image_url: "/houses_new/GTH-SSC_Graphics_Typology_Other_5.png",
    },
  ];
}
</script>

<style scoped>
.v-card {
  transition: opacity 0.2s ease-in-out;
  cursor: pointer;
}
</style>
