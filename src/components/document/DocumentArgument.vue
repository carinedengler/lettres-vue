<template>
  <div
    v-if="(document.argument && document.argument.length) || editable > 0"
    class="panel mt-5"
  >
    <div class="panel-block">
      <rich-text-editor
        v-if="editable"
        v-model="form"
        :enabled="editorEnabled"
        :formats="[
          ['italic', 'superscript'],
          ['person', 'location'],
          ['note', 'link'],
        ]"
        @add-place="addPlace($event, 'argument')"
        @add-person="addPerson($event, 'argument')"
        @add-note="addNote($event)"
      >
        <editor-save-button
          :doc-id="document.id"
          name="argument"
          :value="form"
        />
      </rich-text-editor>
      <div
        v-else
        class="argument__content"
        v-html="form"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import RichTextEditor from "../forms/fields/RichTextEditor";
import EditorSaveButton from "../forms/fields/EditorSaveButton";

export default {
  name: "DocumentArgument",
  components: { EditorSaveButton, RichTextEditor },
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["add-place", "add-person", "add-note"],
  data() {
    return {
      editorEnabled: true,
      form: "",
    };
  },
  computed: {
    ...mapState("document", ["document"]),
  },
  mounted() {
    this.form = this.document.argument || "";
  },
  methods: {
    addPlace(evt, source) {
      this.$emit("add-place", { ...evt, source });
    },
    addPerson(evt, source) {
      this.$emit("add-person", { ...evt, source });
    },
    addNote(evt) {
      this.$emit("add-note", { ...evt });
    },
  },
};
</script>

<style scoped lang="scss">
.notes {
  margin-top: 40px;
  margin-bottom: 40px;
  padding-top: 20px;
  border-top: solid 1px darkgrey;
  color: grey;
}
.section {
  padding-top: 24px;
  padding-bottom: 24px;
}
</style>
