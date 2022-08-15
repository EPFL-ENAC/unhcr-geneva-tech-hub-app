<script lang="ts">
import { Modules } from "@/models/energyModel";
import "vue-class-component/hooks";
import { Component, Prop, VModel, Vue } from "vue-property-decorator";

@Component
export default class EnergyModuleMixin extends Vue {
  @VModel({ type: Object as () => Modules })
  modules!: Modules;
  @Prop({ type: String })
  documentName!: string;
  @Prop({ type: String })
  documentSiteName!: string;
}
</script>
