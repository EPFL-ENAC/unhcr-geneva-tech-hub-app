<template>
  <v-form @submit.prevent="() => submitForm(localProject)">
    <v-container v-if="project.users" fluid>
      <v-row>
        <v-col>
          <v-card elevation="2" rounded>
            <v-card-text>
              <v-row>
                <v-col cols="6" class="force-min-height-for-map">
                  <h2>General</h2>
                  <v-row>
                    <template v-for="(item, index) in generalItems">
                      <v-col
                        v-if="!item.hidden"
                        :key="index"
                        cols="12"
                        sm="6"
                        md="4"
                        lg="3"
                        xl="4"
                      >
                        <form-item-component
                          v-if="item.key !== 'country_code'"
                          v-model="localProject[item.key]"
                          v-bind="item"
                        ></form-item-component>
                        <country-select
                          v-else
                          id="location_country"
                          v-model="localProject.country_code"
                          label="Country"
                          type="text"
                          name="location_country"
                        />
                      </v-col>
                    </template>
                  </v-row>
                </v-col>
                <v-divider vertical></v-divider>
                <v-col cols="6" class="map-countries">
                  <l-map :zoom="zoom" :center="latLng">
                    <l-control-scale
                      :imperial="false"
                      :metric="true"
                    ></l-control-scale>
                    <l-tile-layer
                      :url="url"
                      :attribution="attribution"
                    ></l-tile-layer>
                    <l-marker :lat-lng="latLng"></l-marker>
                  </l-map>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-row v-if="$can('edit', localProject)">
                <v-col class="d-flex justify-end">
                  <v-btn type="submit"> Save changes </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import CountrySelect from "@/components/commons/CountrySelect.vue";
import { FormItem } from "@/components/commons/FormItem";
import FormItemComponent from "@/components/commons/FormItemComponent.vue";
import { GreenHouseGaz } from "@/store/GhgInterface";
import { CouchUser } from "@/store/UserModule";
import { countries as Countries } from "@/utils/countriesAsList";
import getFlagEmoji from "@/utils/flagEmoji";
import {
  attributionMap,
  defaultCoordinates,
  defaultZoom,
  urlMap,
} from "@/utils/mapWorld";
import { LatLngExpression } from "leaflet";
import { cloneDeep } from "lodash";
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";
import { LControlScale, LMap, LMarker, LTileLayer } from "vue2-leaflet";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgModule", ["project"]),
    ...mapGetters("UserModule", ["user"]),
  },
  methods: {
    ...mapActions("GhgModule", ["updateDoc"]),
  },
  components: {
    CountrySelect,
    FormItemComponent,
    LControlScale,
    LMap,
    LMarker,
    LTileLayer,
  },
})
/** ProjectItem */
export default class GhgInfo extends Vue {
  updateDoc!: (doc: GreenHouseGaz) => Promise<void>;
  project!: GreenHouseGaz;
  user!: CouchUser;
  localProject = {} as GreenHouseGaz;

  countriesRef = Countries.map((country) => ({
    ...country,
    emoji: getFlagEmoji(country.code),
  }));

  textRules = [
    (v: string): boolean | string => !!v || `is required`,
    (v: string): boolean | string =>
      v?.length > 1 || `should have a length >= 1`,
  ];

  readonly zoom = defaultZoom;
  readonly defaultCoordinates = defaultCoordinates;
  readonly url = urlMap;
  readonly attribution = attributionMap;

  get latLng(): LatLngExpression {
    const { latitude, longitude } = this.localProject;
    if (latitude !== undefined) {
      return [latitude ?? 0, longitude ?? 0];
    }
    return defaultCoordinates as LatLngExpression;
  }

  get generalItems(): FormItem[] {
    return [
      {
        type: "text",
        key: "name",
        label: "Name of the site",
      },
      {
        type: "number",
        key: "latitude",
        label: "Latitude of the site",
        unit: "Decimal Degrees",
        min: -90,
        max: 90,
      },
      {
        type: "number",
        key: "longitude",
        label: "Longitude of the site",
        unit: "Decimal Degrees",
        min: -180,
        max: 180,
      },
      {
        type: "text",
        key: "country_code",
        label: "Country code",
      },
    ];
  }

  public async submitForm(value: GreenHouseGaz): Promise<void> {
    if (value.name !== "") {
      await this.updateDoc(value);
    } else {
      throw new Error("please fill the new Name");
    }
  }

  public setLocalShelter(project: GreenHouseGaz): void {
    this.localProject = project ? cloneDeep(project) : ({} as GreenHouseGaz);
  }

  public syncLocalShelter(): void {
    // init function
    this.setLocalShelter(this.project);

    this.$store.subscribe((mutation) => {
      const shouldUpdate = ["GhgModule/SET_PROJECT"];
      if (shouldUpdate.includes(mutation.type)) {
        this.setLocalShelter(mutation.payload);
      }
    });
  }

  created(): void {
    this.syncLocalShelter();
  }
}
</script>

<style lang="scss" scoped>
.force-min-height-for-map {
  min-height: calc(100vh - 250px);
}
.map-countries {
  z-index: 1;
}
</style>
