<script lang="ts">
import { Modules } from "@/models/energyModel";
import "vue-class-component/hooks";
import { Component, VModel, Vue } from "vue-property-decorator";

@Component
export default class EnergyModuleMixin extends Vue {
  @VModel({ type: Object as () => Modules })
  modules!: Modules;
}
</script>
