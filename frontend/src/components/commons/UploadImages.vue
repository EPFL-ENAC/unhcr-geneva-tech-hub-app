<template>
  <v-dialog :value="dialog" max-width="450px" @click:outside="closeDialog">
    <v-card
      :class="{ 'grey lighten-2': dragover }"
      @drop.prevent="onDrop($event)"
      @dragover.prevent="dragover = true"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
    >
      <v-form ref="form" v-model="uploadValid">
        <v-app-bar>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon id="close-button">$mdiClose</v-icon>
          </v-btn>
        </v-app-bar>
        <v-card-text>
          <v-row
            class="d-flex flex-column"
            dense
            align="center"
            justify="center"
          >
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
            placeholder="Select file(s)"
            prepend-icon="mdi-camera"
            label="Select file(s)"
            small-chips
            required
            multiple
            show-size
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :loading="loading"
            :disabled="loading || !uploadValid"
            color="blue-grey"
            class="ma-2 white--text"
            data-id="upload-button"
            @click.stop="submit"
          >
            <span class="mx-2">Upload</span>
            <v-icon right dark> $mdiUpload </v-icon>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
// # 10 MB in binary
const max_size = 10 * 1024 * 1024;
export default {
  name: "UploadImages",

  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
      defaut: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      dragover: false,
      uploadValid: true,
      uploadedFiles: [],
      // authorized type: Image / Drawing / Report / Other
      rules: [
        (files) => files.length <= 10 || "no more than 10 files",
        (files) => {
          const result = true;
          const allFilesAreGood = files.reduce((acc, file) => {
            return acc && !!file && file.size < max_size;
          }, result);
          return allFilesAreGood || "image size should be less than 10 MB!";
        },
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
        this.$emit("update:loading", true);
        this.$emit("filesUploaded", this.uploadedFiles);
        // reset on sent
        this.uploadedFiles = [];
      }
    },
  },
};
</script>
