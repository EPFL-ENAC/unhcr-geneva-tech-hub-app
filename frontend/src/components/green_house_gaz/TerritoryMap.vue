<template>
  <l-map :center="defaultCoordinates" :zoom="2" :min-zoom="2">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-marker
      v-for="(coordinate, key) in coordinates"
      :key="key"
      :lat-lng="coordinate"
    ></l-marker>
  </l-map>
</template>

<script lang="ts">
import { Site } from "@/store/GhgInterface";
import {
  attributionMap,
  defaultCoordinates,
  defaultZoom,
  urlMap,
} from "@/utils/mapWorld";
import Vue from "vue";
import Component from "vue-class-component";
import { LIcon, LMap, LMarker, LTileLayer } from "vue2-leaflet";
import { mapGetters } from "vuex";

@Component({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
  },
  computed: {
    ...mapGetters("GhgModule", ["sites"]),
  },
})
export default class TerritoryMap extends Vue {
  readonly url = urlMap;
  readonly attribution = attributionMap;
  readonly zoom = defaultZoom;
  readonly defaultCoordinates = defaultCoordinates;

  readonly otherCoordinates = [43, 2];

  sites!: [];

  public get coordinates(): number[][] {
    return this.sites
      .filter((site: Site) => site.lat !== undefined)
      .map((site: Site): number[] => [site.lat ?? 0, site.lon ?? 0]);
  }
}
</script>
