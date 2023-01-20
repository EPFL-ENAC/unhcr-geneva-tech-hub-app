<template>
  <v-dialog :value="dialog" max-width="450px" @click:outside="closeDialog">
    <v-card
      :class="{ 'grey lighten-2': dragover }"
      @drop.prevent="onDrop($event)"
      @dragover.prevent="dragover = true"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
    >
      <v-card-text>
        <v-row class="d-flex flex-column" dense align="center" justify="center">
          <v-icon :class="[dragover ? 'mt-2, mb-6' : 'mt-5']" size="60">
            mdi-cloud-upload
          </v-icon>
          <p>Drop your file(s) here</p>
        </v-row>
      </v-card-text>
      <v-card-text>
        Or
        <v-file-input
          v-model="uploadedFiles"
          :rules="rules"
          accept="image/png, image/jpeg, image/bmp, image/webp, image/gif, application/pdf"
          placeholder="Select an image"
          prepend-icon="mdi-camera"
          label="Select Images"
          small-chips
          multiple
          show-size
        ></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn icon @click="closeDialog">
          <v-icon id="close-button">$mdiClose</v-icon>
        </v-btn>

        <v-btn icon @click.stop="submit">
          <v-icon id="upload-button">$mdiUpload</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "UploadImages",

  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      dragover: false,
      uploadedFiles: [],
      rules: [
        (value) =>
          !!value ||
          value.size < 2000000 ||
          "image size should be less than 2 MB!",
      ],
    };
  },

  methods: {
    closeDialog() {
      // Remove all the uploaded files
      this.uploadedFiles = [];
      // Close the dialog box
      this.$emit("update:dialog", false);
    },

    removeFile(fileName) {
      // Find the index of the
      const index = this.uploadedFiles.findIndex(
        (file) => file.name === fileName
      );

      // If file is in uploaded files remove it
      if (index > -1) this.uploadedFiles.splice(index, 1);
    },

    onDrop(e) {
      this.dragover = false;

      // If there are already uploaded files remove them
      if (this.uploadedFiles.length > 0) this.uploadedFiles = [];

      // If user has uploaded multiple files but the component is not multiple throw error
      if (!this.multiple && Array.from(e.dataTransfer.files).length > 1) {
        this.$store.dispatch(
          "notifyUser",
          "Only one file can be uploaded at a time.."
        );
      }
      // Add each file to the array of uploaded files
      else
        Array.from(e.dataTransfer.files).forEach((element) =>
          this.uploadedFiles.push(element)
        );
    },

    submit() {
      // If there aren't any files to be uploaded throw error
      if (!this.uploadedFiles.length > 0) {
        this.$store.dispatch("notifyUser", "There are no files to upload");
      } else {
        // Send uploaded files to parent component
        this.$emit("filesUploaded", this.uploadedFiles);
        // Close the dialog box
        this.closeDialog();
      }
    },
  },
};
</script>
