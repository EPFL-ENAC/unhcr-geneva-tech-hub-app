<template>
  <v-container fluid>
    <v-row v-if="$router.currentRoute.name === 'ShelterSustainabilityStep2'">
      <v-col class="d-flex align-center">
        <h2 class="text-h4 project__h3 font-weight-medium">
          {{ infoTooltipText[$route.name].title }}
        </h2>
        <info-tooltip>
          {{ infoTooltipText[$route.name].text }}
        </info-tooltip>
      </v-col>
      <v-spacer />
      <v-col class="col-auto d-flex align-center">
        <span class="mr-4">Project geometry completed ?</span> 
        <v-switch
          v-model="localShelter.completed_geometry"
          @change="updateFormInput"
        ></v-switch>
        <info-tooltip>
          Toggle switch to mark geometry as completed
        </info-tooltip>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-container>
          <v-row>
            <v-col
              v-for="(geometry, $index) in geometries"
              v-show="
                shelter_geometry_type === geometry._id ||
                shelter_geometry_type === ''
              "
              :key="$index"
              class="geometry-column"
              :lg="shelter_geometry_type ? 12 : 6"
              :md="shelter_geometry_type ? 12 : 6"
              sm="12"
              xs="12"
            >
              <v-hover v-slot="{ hover, attrs, on }">
                <v-card
                  :elevation="hover ? 12 : 2"
                  :class="{ 'on-hover': hover }"
                >
                  <v-card-title
                    v-bind="attrs"
                    class="d-flex justify-between flex-column"
                    v-on="on"
                    @click="() => toggleImage(geometry._id)"
                  >
                    <div class="d-flex justify-between flex-row align-center">
                      <v-btn
                        v-if="shelter_geometry_type"
                        float
                        absolute
                        left
                        top
                        @click.stop="unsetImage"
                      >
                        Other geometries
                      </v-btn>
                      <v-img
                        max-width="300px"
                        max-height="160px"
                        class="d-flex justify-center white-background"
                        :src="geometry.image_url"
                        :aria-label="geometry._id"
                      >
                      </v-img>
                      <v-btn icon @click.stop="selectedItem = geometry">
                        <v-icon>{{ mdiMagnify }}</v-icon>
                      </v-btn>
                    </div>

                    <!-- <span>{{ geometry._id }}</span> -->
                    <v-card-title>{{ geometry.name }}</v-card-title>
                  </v-card-title>
                  <v-card-text
                    v-if="!geometry.hiddenInputs && shelter_geometry_type"
                    class="flex-gap-sm d-flex flex-column justify-space-between"
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
                                :value="
                                  localShelter.geometry.shelter_dimensions[
                                    dimension
                                  ]
                                "
                                :name="dimension"
                                :label="dimension"
                                suffix="m"
                                type="number"
                                @change="updateShelterDimensions"
                              />
                            </v-form>
                          </v-card>
                        </v-col>
                        <v-col
                          v-for="(door, $doorKey) in localShelter.geometry
                            .doors_dimensions"
                          :key="`doorsDimension${$doorKey}`"
                          :lg="4"
                          :md="6"
                          sm="12"
                          xs="12"
                        >
                          <v-card>
                            <!-- v-for on all windows -->
                            <v-card-title>
                              Door dimensions
                              <v-btn icon @click="removeDoor($doorKey)">
                                <v-icon>{{ mdiDelete }}</v-icon>
                              </v-btn>
                            </v-card-title>
                            <v-form class="pa-md-4">
                              <v-text-field
                                v-for="(
                                  dimension, $doorDimensionsKey
                                ) in geometry.door_dimensions"
                                :key="`doorDimension${$doorDimensionsKey}`"
                                v-model.number="
                                  localShelter.geometry.doors_dimensions[
                                    $doorKey
                                  ][dimension]
                                "
                                :name="dimension"
                                :label="dimension"
                                suffix="m"
                                type="number"
                                @change="updateShelterDoorDimensions"
                              />
                            </v-form>
                          </v-card>
                        </v-col>
                        <v-col
                          v-for="(window, $windowKey) in localShelter.geometry
                            .windows_dimensions"
                          :key="`windowsDimensions${$windowKey}`"
                          :lg="4"
                          :md="6"
                          sm="12"
                          xs="12"
                        >
                          <v-card>
                            <!-- v-for on all windows -->
                            <v-card-title class="d-flex justify-space-between">
                              Window dimensions
                              <v-btn icon @click="removeWindow($windowKey)">
                                <v-icon>{{ mdiDelete }}</v-icon>
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
                                @change="updateShelterWindowDimensions"
                              />
                            </v-form>
                          </v-card>
                        </v-col>
                        <v-col :lg="4" :md="6" sm="12" xs="12">
                          <v-btn block class="my-4" @click="addDoor">
                            <v-icon left>{{ mdiPlusBox }} </v-icon> Add
                            door</v-btn
                          >
                          <v-btn block @click="addWindow"
                            ><v-icon left>{{ mdiPlusBox }} </v-icon> Add
                            window</v-btn
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
                            v-model.number="
                              localShelter.geometry[resultDimension.key]
                            "
                            :name="resultDimension.label"
                            :label="resultDimension.label"
                            type="number"
                            :disabled="!geometry.hiddenInputs"
                            :suffix="resultDimension.suffix"
                            @change="updateResultDimension"
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>

    <v-overlay v-if="selectedItem" @click="selectedItem = null">
      <v-img
        :src="selectedItem ? selectedItem.image_url : ''"
        contain
        class="d-flex justify-center white-background"
        @click="selectedItem = null"
      ></v-img>
    </v-overlay>
  </v-container>
</template>

<script lang="ts">
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import { infoTooltipText } from "@/components/shelter_sustainability/infoTooltipText";
import {
  DoorDimensions,
  GeometryKeys,
  Shelter,
  ShelterDimensions,
  WindowDimensions,
} from "@/store/ShelterInterface";
import { getNewGeometry } from "@/store/ShelterModuleUtils";
import {
  geometries,
  geometryOtherName,
} from "@/views/shelter_sustainability/ShelterSustainabilityItem/geometries";
import { mdiDelete, mdiMagnify, mdiPlusBox } from "@mdi/js";
import { cloneDeep } from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

/* two ways to have a store copy locally
1. having a watcher on the store that cloneDeep to data() locally
2. having a subscriber to mutation that's initialized at created
cf: https://forum.vuejs.org/t/best-way-to-use-forms-with-local-state-using-v-model-and-sync-to-vuex-store-on- /24739
for the original discussion
*/
@Component({
  components: {
    InfoTooltip,
  },
})
/** Project */
export default class Step2Geometry extends Vue {
  @Prop({ type: [Object], required: true })
  shelter!: Shelter;

  mdiMagnify = mdiMagnify;
  mdiDelete = mdiDelete;
  mdiPlusBox = mdiPlusBox;

  public get localShelter(): Shelter {
    return cloneDeep(this.shelter);
  }

  public set localShelter(newShelter: Shelter) {
    this.$emit("update:shelter", newShelter);
  }

  public updateFormInput(): void {
    this.localShelter = Object.assign({}, this.localShelter);
  }
  selectedItem = null;
  infoTooltipText = infoTooltipText;
  public toggleImage(_id: string): void {
    if (this.localShelter.geometry.shelter_geometry_type === "") {
      this.localShelter.geometry.shelter_geometry_type = _id;
    } else {
      this.localShelter.geometry.shelter_geometry_type = "";
    }
    this.updateFormInput();
  }
  public unsetImage(): void {
    this.localShelter.geometry.shelter_geometry_type = "";
    this.updateFormInput();
  }

  public updateResultDimension(value: string, field: GeometryKeys): void {
    this.localShelter.geometry[field] = parseFloat(value);
    this.updateFormInput();
  }
  get shelter_geometry_type(): string {
    return this.localShelter?.geometry?.shelter_geometry_type;
  }

  public addDoor(): void {
    this.localShelter.geometry.doors_dimensions.push({ Wd: 0, Hd: 0 });
    this.updateHabitability();
    this.updateFormInput();
  }
  public removeDoor(index: number): void {
    this.localShelter.geometry.doors_dimensions.splice(index, 1);
    this.updateHabitability();
    this.updateFormInput();
  }

  public addWindow(): void {
    this.localShelter.geometry.windows_dimensions.push({ Ww: 0, Hw: 0, Hs: 0 });
    this.updateShelterWindowDimensions();
    this.updateFormInput();
  }
  public removeWindow(index: number): void {
    this.localShelter.geometry.windows_dimensions.splice(index, 1);
    this.updateShelterWindowDimensions();
    this.updateFormInput();
  }

  public get hasComputedFloorAndVolume(): boolean {
    const geometryType =
      this.localShelter?.geometry?.shelter_geometry_type ?? "";
    return (
      geometryType.indexOf(this.geometryOtherName) === -1 && geometryType !== ""
    );
  }

  public updateShelterDimensions(): void {
    const newShelterDimensions = this.localShelter.geometry.shelter_dimensions;
    if (newShelterDimensions && this.hasComputedFloorAndVolume) {
      // we need at least L && W for floor Area and Volume
      // works for other since L & W will always be zero for 'Others' type of geometry
      this.localShelter.geometry.floorArea =
        this.floorArea(newShelterDimensions);
      this.localShelter.geometry.volume =
        this.computeVolume(newShelterDimensions);
      this.updateTechnicalPerformance();
    }
    // transmist change above
    this.updateFormInput();
  }
  public updateShelterWindowDimensions(): void {
    const newWindowDimensions = this.localShelter.geometry.windows_dimensions;
    if (newWindowDimensions && this.hasComputedFloorAndVolume) {
      const windowArea = this.windowDimensions(newWindowDimensions);
      this.localShelter.geometry.windowArea = parseFloat(windowArea.toFixed(2));
      this.updateTechnicalPerformance();
    }
    // transmist change above
    this.updateFormInput();
  }

  public updateShelterDoorDimensions(): void {
    this.updateHabitability();
    // transmist change above
    this.updateFormInput();
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
  private updateTechnicalPerformance(): void {
    const { windowArea, floorArea } = this.localShelter.geometry;
    // update technical_performance, because it should be done like this (defined in the specs)
    // Ratio of window and ventilation openings area to floor area > 0.05
    this.localShelter.technical_performance.input_2a_1 =
      windowArea / floorArea > 0.05 ? 1 : undefined;

    // Ratio of windows area to floor area > 0.10
    this.localShelter.technical_performance.input_2c_1 =
      windowArea / floorArea > 0.1 ? 1 : undefined;

    // Window opening dimensions < 60x60cm
    const hasAWindowTooBig =
      this.getMaxWindowArea(this.localShelter.geometry.windows_dimensions) >=
      0.36;
    this.localShelter.technical_performance.input_3b_4 = hasAWindowTooBig
      ? undefined
      : 1;
  }

  private updateHabitability(): void {
    // Door(s) >= 90cm wide INPUT 5 habitability
    const { doors_dimensions } = this.localShelter.geometry;
    if (doors_dimensions.length === 0) {
      return;
    }
    const maxDoorWidth = Math.max(
      ...doors_dimensions.map((door) => door.Wd ?? 0)
    );
    // -1 means false; undefined means not applicable or unknown; 1 means true
    // cf habitabilityForm.ts
    this.localShelter.habitability.input5 = maxDoorWidth < 0.9 ? -1 : 1;
  }

  private doorDimensions(doorDimensions: DoorDimensions[]): number {
    // deprecated. We were using it for Opening area, but it's unused for now
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
  private getMaxWindowArea(windowDimensions: WindowDimensions[]): number {
    if (windowDimensions.length === 0) {
      return 0;
    }
    return Math.max(
      ...windowDimensions.map(({ Ww, Hw }) => {
        if (!Ww || !Hw) {
          return 0; // missing Ww or Hw area is 0
        }
        return Ww * Hw;
      })
    );
  }

  private floorArea(shelterDimension: ShelterDimensions): number {
    const { L, W } = shelterDimension || {};
    let res = 0;
    if (!L || !W) {
      return res; // Length or Width not defined
    }
    if (this.shelter_geometry_type === "dome") {
      const surfaceAreaEllipse = Math.PI * (L / 2) * (W / 2);
      // better to use toPrecision(3)
      res = Math.floor(surfaceAreaEllipse * 100) / 100;
    } else {
      res = L * W;
    }
    const geometry = this.geometries.find(
      (g) => g._id === this.shelter_geometry_type
    );
    if (geometry?.areaFunction) {
      const res = geometry.areaFunction(shelterDimension);
      return parseFloat(res.toFixed(2));
    }
    return parseFloat(res.toFixed(2));
  }

  private computeVolume(shelterDimension: ShelterDimensions): number {
    const geometry = this.geometries.find(
      (g) => g._id === this.shelter_geometry_type
    );
    if (geometry?.volumeFunction) {
      const res = geometry.volumeFunction(shelterDimension);
      return parseFloat(res.toFixed(2));
    }
    throw new Error("should not have a volume");
  }

  dimensions = [
    { label: "Floor area", key: "floorArea", suffix: "m²" },
    { label: "Volume", key: "volume", suffix: "m³" },
    { label: "Window area", key: "windowArea", suffix: "m²" },
  ];

  geometryOtherName = geometryOtherName;
  geometries = geometries;
}
</script>

<style lang="scss">
.flex-gap-sm {
  gap: 16px;
}
</style>

<style scoped>
.v-card {
  transition: opacity 0.2s ease-in-out;
  cursor: pointer;
}

.white-background {
  background-color: white;
}
</style>
