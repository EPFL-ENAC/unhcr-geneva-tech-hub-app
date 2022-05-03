<template>
  <v-dialog
    :value="isDeleteDialogOpen"
    max-width="500px"
    @input="setDeleteDialog"
  >
    <v-form @submit.prevent="() => deleteItem()">
      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDeleteDialog"
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text type="submit">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { Item } from "@/store/ShelterInterface";
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterBillOfQuantitiesModule", ["isDeleteDialogOpen"]),
  },
  methods: {
    ...mapActions("ShelterBillOfQuantitiesModule", [
      "setDeleteDialog",
      "openDeleteDialog",
      "deleteItem",
      "closeDeleteDialog",
    ]),
  },
})
export default class DeleteItemDialog extends Vue {
  openDeleteDialog!: (item: Item) => void;
  deleteItem!: () => void;
  closeDeleteDialog!: () => void;
  setDeleteDialog!: (value: boolean) => void;
  isDeleteDialogOpen!: boolean;
}
</script>

<style></style>
