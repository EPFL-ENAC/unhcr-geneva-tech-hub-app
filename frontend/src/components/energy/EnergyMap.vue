<template>
  <v-responsive :aspect-ratio="aspectRatio" min-height="100%">
    <l-map :zoom="zoom" :center="center">
      <l-control-scale :imperial="false" :metric="true"></l-control-scale>
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker
        v-for="(marker, index) in markers"
        :key="index"
        :lat-lng="marker"
      ></l-marker>
    </l-map>
  </v-responsive>
</template>

<script lang="ts">
import { attributionMap, urlMap } from "@/utils/mapWorld";
import { LatLngExpression } from "leaflet";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
import { LControlScale, LMap, LMarker, LTileLayer } from "vue2-leaflet";

@Component({
  components: {
    LControlScale,
    LMap,
    LMarker,
    LTileLayer,
  },
})
export default class EnergyMap extends Vue {
  readonly url = urlMap;
  readonly attribution = attributionMap;

  @Prop([Number, String])
  readonly aspectRatio: number | string | undefined;
  @Prop({ type: Array as () => LatLngExpression[], default: () => [] })
  readonly markers!: LatLngExpression[];
  @Prop({ type: Number, default: 2 })
  readonly zoom!: number;

  get center(): LatLngExpression | undefined {
    if (this.markers.length === 1) {
      return this.markers[0];
    }
    return undefined;
  }
}
</script>

<style lang="scss" scoped>
.leaflet-container {
  z-index: 0;
}
</style>
