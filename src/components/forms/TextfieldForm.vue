<template>
  <modal-form
    :title="title"
    :cancel="cancelAction"
    :submit="submitAction"
    :remove="remove"
    :valid="form.length >= 1"
    :submitting="false"
  >
    <div class="location-form textinput-form">
      <form @submit.prevent="">
        <div class="field">
          <label class="label">{{ label }}</label>
          <div class="control">
            <input
              ref="field"
              v-model="form"
              class="input"
              type="text"
            >
          </div>
        </div>
      </form>
    </div>
  </modal-form>
</template>

<script>
import ModalForm from "./ModalForm";

export default {
  name: "TextfieldForm",
  components: {
    ModalForm,
  },
  props: {
    title: { type: String, default: "" },
    label: { type: String, default: "" },
    value: { type: String, default: "" },
    cancel: { type: Function, default: () => {} },
    submit: { type: Function, default: () => {} },
    remove: { type: Function, default: () => {} },
  },
  data() {
    return {
      form: this.value,
    };
  },
  mounted() {
    this.$refs.field.focus();
  },
  methods: {
    submitAction() {
      this.$props.submit(this.form);
    },
    cancelAction() {
      this.$props.cancel();
    },
    removeAction() {
      this.$props.cancel();
    },
  },
};
</script>
