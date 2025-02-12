<template>
  <div
    class="root-container"
    :class="popupMode ? 'box modal-card' : ''"
    style="width: 1024px !important"
  >
    <div class="root-grid-container" :class="popupMode ? 'popup-mode' : ''">
      <div v-if="popupMode" class="leftbar-header-area">
        <h1 class="step-label is-uppercase is-size-2">
          {{ wizardLabel }}
        </h1>
        <h2 v-if="subtitle" class="step-label is-uppercase is-size-5 mb-3">
          {{ subtitle }}
        </h2>
        <h2 v-if="currentStep.label" class="step-label is-uppercase is-size-5">
          {{ currentStep.label }}
        </h2>
      </div>
      <div v-if="popupMode" class="leftbar-content-area">
        <b-tabs v-model="activeTab" :animated="false">
          <b-tab-item
            v-for="(stepItem, i) in stepItems"
            :key="`left-step-${i}`"
            :label="stepItem.left ? stepItem.left.label : `left-step-${i}`"
          >
            <keep-alive v-if="stepItem.left">
              <component
                :is="stepItem.left.component"
                v-bind="stepItem.left.attributes"
                @goto-wizard-step="gotoStep"
                @manage-person-data="managePersonData"
              />
            </keep-alive>
          </b-tab-item>
        </b-tabs>
      </div>
      <div v-if="popupMode" class="leftbar-footer-area" />

      <div class="center-content-area">
        <b-tabs v-model="activeTab">
          <b-tab-item
            v-for="(stepItem, i) in stepItems"
            :key="`center-step-${i}`"
            :label="stepItem.center ? stepItem.center.label : `center-step-${i}`"
          >
            <keep-alive v-if="stepItem.center">
              <component
                :is="stepItem.center.component"
                v-bind="stepItem.center.attributes"
                @goto-wizard-step="gotoStep"
                @manage-person-data="managePersonData"
              />
            </keep-alive>
          </b-tab-item>
        </b-tabs>
      </div>
      <div v-if="popupMode" class="center-footer-area">
        <div class="buttons">
          <b-button type="is-primary" size="is-medium" @click="closeWizard">
            Annuler
          </b-button>

          <b-button
            v-if="currentStep.prev"
            type="is-primary"
            size="is-medium"
            class="previous-button"
            @click="gotoPrevStep"
          >
            Précédent
          </b-button>

          <b-button
            :disabled="!currentStep.next"
            type="is-primary"
            size="is-medium"
            @click="gotoNextStep"
          >
            <span>Suivant</span>
          </b-button>

          <span v-for="(stepItem, i) in stepItems" :key="`footer-buttons-step-${i}`">
            <span v-if="stepItem.footer && activeTab === i">
              <b-button
                v-for="(button, j) in stepItem.footer.buttons"
                :key="`button-${j}`"
                :type="button.type ? button.type : 'is-primary'"
                size="is-medium"
                :loading="loading"
                @click="button.action()"
              >
                {{ button.label }}
              </b-button>
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import SelectOrCreatePersonForm from "@/components/forms/person/SelectOrCreatePersonForm.vue";
import PersonInfoCard from "@/components/forms/person/PersonInfoCard.vue";
import FunctionPersonForm from "@/components/forms/person/FunctionPersonForm.vue";

export default {
  name: "PersonWizardForm",
  components: {
    SelectOrCreatePersonForm,
    PersonInfoCard,
    FunctionPersonForm,
  },
  props: {
    subtitle: { type: String, default: null },
    popupMode: { type: Boolean, default: true },
    inputData: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },
  data() {
    return {
      activeTab: 0,
      person: {},
      loading: false,
    };
  },
  computed: {
    ...mapState("document", ["document"]),
    ...mapGetters("persons", ["getRoleByLabel"]),

    wizardLabel() {
      return "Correspondants";
    },
    currentStep() {
      return this.stepItems[this.activeTab > -1 ? this.activeTab : 0];
    },
    stepItems() {
      return [
        {
          name: "select-or-create",
          next: this.person && this.person.label ? "set-description" : null,
          left: {
            label: "left",
            component: "PersonInfoCard",
            attributes: { person: this.person },
          },
          center: {
            label: "center",
            component: "SelectOrCreatePersonForm",
            attributes: { person: this.person, popupMode: this.popupMode },
          },
        },
        {
          name: "set-description",
          prev: "select-or-create",
          left: {
            label: "left",
            component: "PersonInfoCard",
            attributes: { person: this.person },
          },
          center: {
            label: "center",
            component: "FunctionPersonForm",
            attributes: { person: this.person },
          },
          footer: {
            buttons: [{ label: "Terminer", type: "is-primary", action: this.savePerson }],
          },
        },
      ];
    },
  },
  async created() {
    await this.$store.dispatch("persons/fetchAllPersons");
    await this.$store.dispatch("persons/fetchRoles");
    let person = {};

    if (this.$props.inputData) {
      const p = this.$props.inputData;
      const id = p.formats && p.formats.person ? p.formats.person : null;

      if (p.label !== null) {
        person.label = p.label;
      }
      if (p.selection !== null) {
        person.selection = p.selection;
      }
      if (p.description !== null) {
        person.description = p.description;
      }
      if (p.ref !== null) {
        person.ref = p.ref;
      }
      if (p.role !== null) {
        person.role = p.role;
      }
      if (p.restoreRangeCallback !== null) {
        person.restoreRangeCallback = p.restoreRangeCallback;
      }
      if (p.insertTagCallback !== null) {
        person.insertTagCallback = p.insertTagCallback;
      }
      if (p.removeTagCallback !== null) {
        person.removeTagCallback = p.removeTagCallback;
      }

      if (id !== null) {
        person.id = id;

        //load existing data
        const item = await this.$store.dispatch("persons/getInlinedPersonsWithRoleById", {
          docId: this.document.id,
          personId: person.id,
        });
        person = {
          ...person,
          ...item.person,
          ...item.phr,
          description: item.phr.function,
          phrId: item.phrId,
        };

        console.log("ITEM", person);
      }
    }

    this.person = person;
  },
  mounted() {
    this.$store.dispatch("persons/setPageSize", 5);
  },
  methods: {
    gotoStep(stepName) {
      const nextStepIndex = this.stepItems.findIndex((s) => s.name === stepName);
      if (nextStepIndex > -1) {
        this.activeTab = nextStepIndex;
      }
    },
    gotoNextStep() {
      const nextStep = this.stepItems[this.activeTab].next;
      if (nextStep) {
        this.gotoStep(nextStep);
      }
    },
    gotoPrevStep() {
      const prevStep = this.stepItems[this.activeTab].prev;
      if (prevStep) {
        this.gotoStep(prevStep);
      }
    },
    managePersonData({ action, data }) {
      console.log(`person[${action.name}]`, data);
      switch (action.name) {
        case "set-person":
          if (this.popupMode) {
            this.person = {
              role: this.person.role,
              source: this.person.source,
              restoreRangeCallback: this.person.restoreRangeCallback,
              insertTagCallback: this.person.insertTagCallback,
              removeTagCallback: this.person.removeTagCallback,
            };
          }
          this.person = {
            ...this.person,
            ...data,
          };
          break;
        case "set-description":
          this.person.description = data;
          break;
        default:
          break;
      }
      this.person = { ...this.person };
    },
    closeWizard() {
      if (this.person && this.person.restoreRangeCallback) {
        this.person.restoreRangeCallback();
      }

      this.loading = false;

      if (this.$parent.close) {
        this.$parent.close();
      }
    },
    async savePerson() {
      this.loading = true;
      if (this.person) {
        let personToSave = {
          ref: this.person.ref,
          label: this.person.label,
        };

        if (this.person.id) {
          personToSave.id = this.person.id;
        } else {
          const response = await this.$store.dispatch("persons/addPerson", personToSave);
          personToSave.id = response.id;
        }

        // when editing a document
        if (this.popupMode) {
          console.log(this.person);
          if (this.person.role && personToSave.id) {
            // link the person to the document
            const role = this.getRoleByLabel(this.person.role);
            const roleId = role && role.id ? role.id : null;

            await this.$store.dispatch("persons/linkToDocument", {
              personId: personToSave.id,
              roleId,
              func: this.person.description,
              phrId: this.person.phrId,
            });

            // and then insert the tag in the content
            if (this.person.restoreRangeCallback) {
              this.person.restoreRangeCallback();
              this.person.insertTagCallback(personToSave.id);
            }

            // if not inlined, refresh the persons
            if (!this.person.role !== "inlined") {
              await this.$store.dispatch("document/fetch", this.document.id);
            }
          }
        }
      }
      this.closeWizard();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

.root-container {
  overflow: hidden;

  min-height: 720px;
  min-width: 960px;

  width: 100%;
  height: inherit;

  padding: 0px !important;

  .label {
    color: inherit !important;
  }

  .step-label {
    font-family: $bitter-family;
    padding: 12px;
  }

  .wizard-center-form {
    margin-left: 12px;
    margin-right: 12px;
    min-width: 300px;
  }

  .previous-button {
    margin-left: 40px;
  }

  .leftbar-header-area,
  .leftbar-content-area,
  .leftbar-footer-area {
    background-color: $light !important;
  }

  .leftbar-header-area {
    grid-area: leftbar-header;
    h1 {
      padding-bottom: 0px;
    }
    h2 {
      padding-top: 0px;
      top: -12px;
      position: relative;
      left: 0px;
    }
  }
  .leftbar-content-area {
    grid-area: leftbar-content;
  }
  .leftbar-footer-area {
    grid-area: leftbar-footer;

    .buttons {
      margin-right: 20px;

      float: right;
      top: calc(50% - 26px);
      position: relative;
    }
  }

  .center-content-area {
    grid-area: center-content;
    height: 100%;

    & > .b-tabs {
      height: 100%;
      .tab-content {
        padding: 0;
      }
      .tab-content,
      .tab-item {
        height: 100%;
      }
    }
  }
  .center-footer-area {
    grid-area: center-footer;
    justify-self: end;
    align-self: center;
    .buttons {
      margin-right: 20px;
    }
  }

  .root-grid-container {
    display: grid;
    min-height: inherit;
    height: 100%;

    grid-template-columns: auto;
    grid-template-rows: auto;
    grid-template-areas: "center-content";
  }
  .popup-mode {
    grid-template-columns: 320px auto;
    grid-template-rows: 120px auto 80px;
    grid-template-areas:
      "leftbar-header center-content"
      "leftbar-content center-content"
      "leftbar-footer center-footer";
  }
}

.root-container::v-deep .b-tabs .tabs:first-of-type {
  display: none;
}
</style>
