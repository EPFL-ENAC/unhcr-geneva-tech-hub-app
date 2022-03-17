<template>
  <l-map :center="[46.8, 8.1]" :zoom="3">
    <l-tile-layer
      url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
      attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
    ></l-tile-layer>
  </l-map>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { LIcon, LMap, LMarker, LTileLayer } from "vue2-leaflet";

@Component({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
  },
})
export default class TerritoryMap extends Vue {}
</script>
