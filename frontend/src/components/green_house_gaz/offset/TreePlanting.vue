<template>
  <v-container fluid>
    <survey-item-title :title-key="title" />
    <survey-item-default-form :form="form" @update:form="updateCurrentSurvey" />
  </v-container>
</template>

<script lang="ts">
import SurveyItemDefaultForm from "@/components/green_house_gaz/SurveyItemDefaultForm.vue";
import SurveyItemTitle from "@/components/green_house_gaz/SurveyItemTitle.vue";
import { FormSurvey } from "@/store/GhgInterface";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    SurveyItemDefaultForm,
    SurveyItemTitle,
  },
})
export default class CRI extends Vue {
  @Prop({ type: String, required: true, default: "" })
  readonly titleKey!: string;

  @Prop([Object, Array])
  readonly form!: FormSurvey | undefined;

  public updateCurrentSurvey(newForm: FormSurvey): void {
    this.$emit("update:form", newForm);
  }

  public get title(): string {
    return this.titleKey;
  }
}
</script>

<style></style>
