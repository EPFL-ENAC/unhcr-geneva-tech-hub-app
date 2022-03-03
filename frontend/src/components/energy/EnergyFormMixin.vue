<script lang="ts">
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class EnergyFormMixin<M> extends Vue {
  @Prop({ type: Object as () => M })
  readonly initialModule: M | undefined;

  save(module: M): void {
    this.$emit("save", module);
  }
}
</script>
