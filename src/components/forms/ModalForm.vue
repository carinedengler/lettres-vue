<template>
  <div class="modal is-active">
    <div
      class="modal-background"
      @click="cancel"
    />
    <div class="modal-card">
      <header class="modal-card-head">
        <p
          class="modal-card-title"
          v-html="title"
        />
        <button
          class="delete"
          aria-label="close"
          @click="cancel"
        />
      </header>
      <section class="modal-card-body">
        <slot />
      </section>
      <footer class="modal-card-foot">
        <button
          v-if="submit"
          class="button is-success"
          :disabled="!valid || submitting"
          @click="submit"
        >
          {{ submitText }}
        </button>
        <button
          v-if="cancel"
          class="button"
          :disabled="submitting"
          @click="cancel"
        >
          Annuler
        </button>
        <div
          v-if="remove"
          style="float: right; width: 100%; text-align: right"
        >
          <button
            class="button is-danger"
            :disabled="submitting"
            @click="remove"
          >
            {{ removeText }}
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalForm",
  props: {
    title: { type: String, default: "" },
    cancel: { type: Function, default: () => {} },
    submit: { type: Function, default: () => {} },
    remove: { type: Function, default: () => {} },
    valid: { type: Boolean, required: true },
    submitText: { type: String, default: "Enregistrer" },
    removeText: { type: String, default: "Supprimer" },
    submitting: { type: Boolean, default: false },
  },
  mounted() {
    document.addEventListener("keyup", this.onKeyUp);
  },
  beforeDestroy() {
    document.removeEventListener("keyup", this.onKeyUp);
  },
  methods: {
    onKeyUp(e) {
      if (!(e.target === document.body)) return;
      if (e.code === "Enter") this.submit();
      else if (e.code === "Escape") this.cancel();
    },
  },
};
</script>
